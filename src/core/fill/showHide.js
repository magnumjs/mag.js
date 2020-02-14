import {matchingElements} from "./matches"
import {
    nodeListToArray,
    getUid,
    removeNode,
    getCheckForMod
} from "./common"
import {MAGNUM} from "../constants"

const childCache = {};

const checkForMod = getCheckForMod()


export function reattachChildren(node, key, removeOnly) {
    let matches;
    if(key) {
        matches = matchingElements(node, key);
    } else {
        matches = nodeListToArray(node.childNodes.length?node.childNodes:node)
    }

    // if(matches.length == 1 && matches[0][MAGNUM] && matches[0][MAGNUM].detachedUids){
    //     matches[0][MAGNUM].detachedUids.forEach(uid=>{
    //         console.log(childCache[uid], uid)
    //         matches[0].appendChild(childCache[uid][0])
    //         delete childCache[uid];
    //
    //     })
    // }

    matches.forEach(function(item) {
        var uid = getUid(item);

        if (uid in childCache) {
            if (!removeOnly) {
                for (var index in childCache[uid]) {
                    item.appendChild(childCache[uid][index]);
                }
            }
            delete childCache[uid];
        }
    });
}

export function removeChildren(node, key) {
    let called = 0,
        expected = 1;
    const continuation = function(item) {
        if (++called === expected) {
            // remove children
            while (item.lastChild) {
                removeNode(item.lastChild);
            }
        }
    };

    let matches;
    if(key) {
        matches = matchingElements(node, key);
    } else {
        matches = nodeListToArray(node)
    }

    // node[MAGNUM] = node[MAGNUM] || {}
    //
    // node[MAGNUM].detachedUids =[]

        matches.forEach(function(item) {
        var uid = getUid(item);
        if (item.childNodes.length) childCache[uid] = nodeListToArray(item.childNodes);
        // else {
        //     childCache[uid] = nodeListToArray(item);
        //     node[MAGNUM].detachedUids.push(uid)
        // }

        var called = 0;
        // check child cache for unloaders
        for (var k in childCache[uid]) {
            var child = childCache[uid][k];
            checkForMod(child, function() {
                continuation(item);
            }, expected);
        }
        continuation(item);
    });
}
