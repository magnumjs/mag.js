import runFun from "./draw/runFun"
import {MAGNUM} from './constants';
import {isHTMLEle, isFunction} from "./utils/common"
import dom from "./dom/tagged-dom"
import mag from "./mag"

mag.dom = dom

export default function(idOrNode, mod, dprops, run, find, lastCall) {
    if(idOrNode.raw) {
        return dom.apply(this, arguments)
    }
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
    else if (isFunction(mod) && isHTMLEle(idOrNode)) {
        // fake run with no output
        try {
            runFun(idOrNode.cloneNode(1), mod, dprops, true)();
        } catch (e) {}

        return runFun(idOrNode, mod, dprops);
    } else if(lastCall) {
        return lastCall(idOrNode, mod, dprops)
    }
}