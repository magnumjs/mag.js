import runFun from "./draw/runFun"
import {MAGNUM} from './constants';
import {isHTMLEle} from "./utils/common"

export default function(idOrNode, mod, dprops, run, find, lastCall) {
    idOrNode = find(idOrNode);
    mod = find(mod);
    dprops = dprops || {};

    if (isHTMLEle(mod) && isHTMLEle(idOrNode)) {
        //attach to node once
        if (!mod[MAGNUM]) {
            //Add to scheduleFlush, nextTick?
            run(mod, idOrNode);
        }
    }
    //If mod is a function?
    else if (typeof mod == 'function' && isHTMLEle(idOrNode)) {
        // fake run with no output
        try {
            runFun(idOrNode.cloneNode(1), mod, dprops, true)();
        } catch (e) {}

        return runFun(idOrNode, mod, dprops);
    } else if(lastCall) {
        return lastCall(idOrNode, mod, dprops)
    }
}