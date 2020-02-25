import mag from "../mag-stateless"
import {MAGNUM, _cprops} from '../constants';
import {getId, setId, run} from "../../fill-stateless"
import {callLCEvent} from "../utils/events"
import {copy, extend, isObject, isUndefined, isFragment} from "../utils/common"

let inc = 0;
var runFun = function(idOrNode, mod, dprops, fake) {
    var clones = [],
        clone = idOrNode.cloneNode(1),
        cache = [],
        //last = [],
        runId,
        copyOfDefProps = [];

    var a = function(props) {

        var node = idOrNode;
        props = props || {};
        var key;
        if (!isUndefined(props.key)) key = props.key + '-' + a.id;
        var ckey = !isUndefined(props.key) ? props.key + '-' + a.id : a.id;

        if (!copyOfDefProps[ckey]) {
            copyOfDefProps[ckey] =
                isObject(dprops) ? copy(dprops) : dprops;
        }

        // retrieve props & merge
        if (isObject(props)) {
            props = extend(copyOfDefProps[ckey], props);
        }

        if (key && !clones[key]) {
            node = clones[key] = clone.cloneNode(1);
        } else if (key && clones[key]) {
            node = clones[key];
        }
        // else if(isFragment(node) && node[MAGNUM] && node[MAGNUM].parent){
        //     //get current children and place in fragment
        //     const vals = node[MAGNUM]
        //     node = node[MAGNUM].parent
        //     node[MAGNUM] = vals
        // }

        if(!isUndefined(a) && props && props.key && a.key && a.key != ckey) {
            callLCEvent('onunload', props, node, a.key);
        }

        //Block recursivity
        if (runId && runId == node[MAGNUM].scid) {
            throw Error('MagJS Error - recursive call:' + runId);
        }


        node[MAGNUM] = node[MAGNUM] || {};
        //TODO: copy props to NODE? for children
        node[MAGNUM].props = copy(props);
        if (mag._cprops[ckey] && isObject(props)) {
            props.children = _cprops[ckey];
        }

        a.props = props;
        a.key = ckey;
        a.fake = fake;
        var now;
        try {
            var _current = mag._current;
            mag._current = a;
            now = mod(props);
            runId = node[MAGNUM].scid = ckey;
            //NEED? previous props?
            // last[ckey] = toJson(props);
            var pfillId = getId();
            //TODO: find parent
            if (pfillId && pfillId[MAGNUM] && pfillId[MAGNUM].scid) {
                node[MAGNUM].pscid = pfillId[MAGNUM].scid;
            }
            setId(node);
            run(node, now);
        } finally {
            //replace fragment html
            var frag= node.querySelector('fragment')
            //FASTER?
            if(frag && !fake) frag.replaceWith(...frag.childNodes)

            // if(frag && !fake){
            //     const vals = frag[MAGNUM] || {}
            //
            //     var cnodes= Array.from(frag.childNodes)
            //    cnodes.forEach((item, key)=>{
            //
            //         //add key increment each if no key
            //        item[MAGNUM] = item[MAGNUM] || vals// use merge?
            //        item[MAGNUM].scid = vals.scid || ckey + "-"+key
            //        frag.parentNode.appendChild(item)
            //    })
            //     frag.remove()
            // }
            callLCEvent('didupdate', props, node, ckey);
            setId(pfillId);
            runId = 0;
            mag._current = _current;
        }
        // }

        return node;
    };
    a.id = ++inc;
    a.element = clone;

    return a;
};


export default runFun;