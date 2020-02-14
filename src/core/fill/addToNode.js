import {isCached, getItems, getDraw, getMod, removeNode, getMicroDraw, nodeListToArray} from "./common"
import {onLCEvent} from "../utils/events"
import {isFragment} from "../utils/common"
import {MAGNUM, _cprops, doc} from '../constants'

const items = getItems()
const magRedraw = getDraw()
const mods = getMod()
const microDraw = getMicroDraw()

export default function addToNode(node, val, onlyAdd) {

    //TODO: finer grain diffing, attach once
    if (val.outerHTML && isCached(node, val.outerHTML)
    ) {
        return;
    }

    if (
        (!val.id && !node.childNodes[0]) ||
        (val.id && !doc.getElementById(val.id)) ||
        (node.firstChild && !node.firstChild.isEqualNode(val))
    ) {
        // take children and add to properties
        let index
        if(items) {
          index=  items.getItem(val.id);
        }
        if (items && ~index && node.hasChildNodes()) {
            var pindex = items.getItem(getId());
            var clone = node.cloneNode(1);
            clone[MAGNUM] = {
                childof: pindex
            };
            if(mods && mods.getProps) {
                mods.getProps(index).children = clone;
            }
            //redraw?
            magRedraw(val, index)
        } else if (val[MAGNUM] && val[MAGNUM].scid  && !_cprops[val[MAGNUM].scid]) {
            clone = node.cloneNode(1);
            clone[MAGNUM] = {
                childof: val[MAGNUM].scid
            };
            _cprops[val[MAGNUM].scid] = clone;
        }

        //remove, replace?
        //Remove children, call UNLOADERS?
        if(!onlyAdd){
            while (node.lastChild) {
                // removeNodeModule(node.lastChild)
                // node.removeChild(node.lastChild)
                removeNode(node.lastChild);
            }
        }

        //TODO: Call configs when adding?

        if (val[MAGNUM] && val[MAGNUM]['childof'] !== undefined) {
            node.innerHTML = val.innerHTML;

            var cid = val[MAGNUM]['childof'];

            //Not stateless
            if (!_cprops[cid] && microDraw) {
                microDraw(node, cid);

                //subscribe once to the parent to notify the child of changes to the state
                //only once?
                onLCEvent('willupdate', cid, () => {
                    microDraw(node, cid);
                });
            }
        } else {
            // if(val[MAGNUM].parent && !isFragment(val)){
            //     var childs = nodeListToArray(val[MAGNUM].parent.childNodes)
            //     childs.forEach((item,key)=>addToNode(node, item, 1))
            //     return
            // } else
            // if(isFragment(val) && val[MAGNUM]){
            //     val[MAGNUM].parent = node
            // }

                node.appendChild(val)

        }
    }
}