import runFun from './draw/runFun';
import {MAGNUM, doc} from './constants';
import {isHTMLEle, isFunction, isFragment} from './utils/common';

export default function(idOrNode, mod, dprops, run, find, lastCall) {
  idOrNode = find(idOrNode);
  mod = find(mod);
  dprops = dprops || {};

  if (isHTMLEle(mod) && (isHTMLEle(idOrNode) || isFragment(idOrNode))) {
    //attach to node once
    if (!mod[MAGNUM]) {
      //Add to scheduleFlush, nextTick?
      run(mod, idOrNode);
    }
  }
  //If mod is a function But NO node
  else if (isFunction(idOrNode)) {
    // attache fake parent container -- remove later??
    return funcRunner(doc.createElement('fragment'), idOrNode, dprops);
    //If mod is a function?
  } else if (isFunction(mod) && (isHTMLEle(idOrNode) || isFragment(idOrNode))) {
    // fake run with no output
    return funcRunner(idOrNode, mod, dprops);
  } else if (lastCall) {
    return lastCall(idOrNode, mod, dprops);
  }
}

function funcRunner(idOrNode, mod, dprops) {
  try {
    runFun(idOrNode.cloneNode(1), mod, dprops, true)();
  } catch (e) {}

  return runFun(idOrNode, mod, dprops);
}
