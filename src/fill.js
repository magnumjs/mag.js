import {MAGNUM} from './core/constants'
import {callLCEvent} from "./core/utils/events"
import {items} from "./utils"
import {getState, clear, remove, innerMods, getModId, getProps, getMod} from "./module"
import hook from "./core/hook"
import magRedraw from "./core/draw/redraw"
import {
  removeNode,
  configs,
  cached,
  clearCache,
  getId,
  setId,
  setItems,
  setMod,
  setDraw,
  setHook,
  setRemoveNodeModule,
  setCheckForMod,
  setMicroDraw
} from "./core/fill/common"
import {matchingElements} from "./core/fill/matches"
import run from "./core/fill/run"

function checkForMod(node, onremove, expected) {
    var instanceID;
    if (node.id && items.isItem(node.id)) {
        instanceID = items.getItem(node.id);
    }
    if (!instanceID && node[MAGNUM] && node[MAGNUM].scid) {
        callLCEvent('onunload', {}, node, node[MAGNUM].scid);
    }
    // check if onbeforeunload exists
    else if (instanceID && getState(instanceID).onbeforeunload) {
        expected++;
        //call first
        //TODO: call children nodes with hooks too
        callLCEvent(
            'onbeforeunload',
            getState(instanceID),
            node,
            instanceID,
            0,
            function() {
                if (instanceID)
                    callLCEvent(
                        'onunload',
                        getState(instanceID),
                        node,
                        instanceID
                    );
                onremove();
            }
        );
    } else {
        if (instanceID)
            callLCEvent(
                'onunload',
                getState(instanceID),
                node,
                instanceID,
                1
            );
        onremove();
    }
};
function removeNodeModule(node) {
    //inner mods too?
    var instanceId = items.getItem(node.id);
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            removeNodeModule(node.children[i]);
        }
    }
    if (~instanceId) {
        callLCEvent(
            'onunload',
            getState(instanceId),
            node,
            instanceId
        );
        clear(instanceId);
        remove(instanceId);
        clearCache(getModId(instanceId));
    } else if (node[MAGNUM] && node[MAGNUM].scid) {
        callLCEvent('onunload', {}, node, node[MAGNUM].scid);
    }
}
function microDraw(node, cid) {
    var pfillId = getId();
    setId(getModId(cid));
    run(node, getState(cid));
    setId(pfillId);
}

setRemoveNodeModule(removeNodeModule)
setCheckForMod(checkForMod)

setMod({getMod, getProps, innerMods})
setDraw(magRedraw)
setItems(items)
setHook(hook)
setMicroDraw(microDraw)



export {run, setId, getId, matchingElements, clearCache, cached, removeNode}
