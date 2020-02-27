import {isCached, getItems, getDraw, getMod, removeNode, getMicroDraw, nodeListToArray} from "./common"
import {onLCEvent} from "../utils/events"
import {isFragment} from "../utils/common"
import {MAGNUM, _cprops, doc} from '../constants'

const items = getItems()
const magRedraw = getDraw()
const mods = getMod()
const microDraw = getMicroDraw()

const isNotInNode = (node, val) => {
    var magVals = val[MAGNUM]
    var magNVals = node[MAGNUM]
    if(!magVals || magVals.scid && !magNVals.children ||
        magVals && magVals.scid && magNVals.children && !~magNVals.children.indexOf(magVals.scid)){
        return true
    }
}

export default function addToNode(node, val, onlyAdd) {



    if(val.func){
        val = val.func(val.props)
    }

    var extra
    if(val[MAGNUM] && !node[MAGNUM].children){
        extra =  val[MAGNUM].scid
    }

    //TODO: finer grain diffing, attach once
    if (val.outerHTML && isCached(node, val.outerHTML, extra)) {
        return;
    }

    if (
        (!val.id && !node.childNodes[0]) ||
        (val.id && !doc.getElementById(val.id)) ||
        (node.firstChild && !node.firstChild.isEqualNode(val)
            || isNotInNode(node, val))
    ) {


        // take children and add to properties
        let index
        if (items) {
            index = items.getItem(val.id);
        }
        if (items && ~index && node.hasChildNodes()) {
            var pindex = items.getItem(getId());
            var clone = node.cloneNode(1);
            clone[MAGNUM] = {
                childof: pindex
            };
            if (mods && mods.getProps) {
                mods.getProps(index).children = clone;
            }
            //redraw?
            magRedraw(val, index)
        } else if (val[MAGNUM] && val[MAGNUM].scid && !_cprops[val[MAGNUM].scid]) {
            clone = node.cloneNode(1);
            clone[MAGNUM] = {
                childof: val[MAGNUM].scid
            };
            _cprops[val[MAGNUM].scid] = clone;
        }

        //remove, replace?
        //Remove children, call UNLOADERS?
        if (!onlyAdd) {
            while (node.lastChild) {
                // removeNodeModule(node.lastChild)
                // node.removeChild(node.lastChild)
                removeNode(node.lastChild);
            }
        }


        if (val[MAGNUM] && val[MAGNUM].scid) {
            node[MAGNUM].children = node[MAGNUM].children || []
            if (isNotInNode(node, val)) {
                node[MAGNUM].children.push(val[MAGNUM].scid)
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