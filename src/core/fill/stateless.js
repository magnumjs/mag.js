import {MAGNUM} from '../constants'
import {callLCEvent} from "../utils/events"

export function checkForMod(node, onremove) {

    if (node[MAGNUM] && node[MAGNUM].scid) {
        callLCEvent('onunload', {}, node, node[MAGNUM].scid);
    }
    else {

        onremove();
    }
}

export function removeNodeModule(node) {
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