import {MAGNUM} from './core/constants';
import {callLCEvent} from './core/utils/events';
import {
  removeNode,
  cached,
  clearCache,
  getId,
  setId,
  setCheckForMod,
  setRemoveNodeModule
} from './core/fill/common';
import {matchingElements} from './core/fill/matches';
import run from './core/fill/run';

function checkForMod(node, onremove) {
  if (node[MAGNUM] && node[MAGNUM].scid) {
    callLCEvent('onunload', {}, node, node[MAGNUM].scid);
  } else {
    onremove();
  }
}
function removeNodeModule(node) {
  //inner mods too?
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      removeNodeModule(node.children[i]);
    }
  }
  if (node[MAGNUM] && node[MAGNUM].scid) {
    callLCEvent('onunload', {}, node, node[MAGNUM].scid);
  }
}

setCheckForMod(checkForMod);
setRemoveNodeModule(removeNodeModule);

// this is the entry point for this module, to fill the dom with data

export {run, setId, getId, matchingElements, clearCache, cached, removeNode};
