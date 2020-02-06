import mag from "../mag-stateless"
import {MAGNUM} from '../constants';
import {getId, setId, run} from "../../fill-stateless"
import {callLCEvent} from "../utils/events"
import {copy, extend, toJson} from "../utils/common"

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
        if (props.key !== undefined) key = props.key + '-' + a.id;
        var ckey = props.key !== undefined ? props.key + '-' + a.id : a.id;

        if (!copyOfDefProps[ckey]) {
            copyOfDefProps[ckey] =
                typeof dprops == 'object' ? copy(dprops) : dprops;
        }

        // retrieve props & merge
        if (typeof props == 'object') {
            props = extend(copyOfDefProps[ckey], props);
        }

        if (key && !clones[key]) {
            node = clones[key] = clone.cloneNode(1);
        } else if (key && clones[key]) {
            node = clones[key];
        }

        if(typeof a !== undefined && props && props.key && a.key && a.key != ckey) {
            callLCEvent('onunload', props, node, a.key);
        }

        //Block recursivity
        if (runId && runId == node[MAGNUM].scid) {
            throw Error('MagJS Error - recursive call:' + runId);
        }


        node[MAGNUM] = node[MAGNUM] || {};

        if (mag._cprops[ckey] && typeof props == 'object') {
            props.children = mag._cprops[ckey];
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