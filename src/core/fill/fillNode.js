import {MAGNUM} from '../constants'
import {isHTMLEle} from "../utils/common"
import {getPathTo, getFullPathIndex, getPathIndex, getId, getMod} from "./common"
import addToNode from "./addToNode"
import findAllAttributes from "./findAllAttributes"
import fillAttributes from "./fillAttributes"
import findNonAttributes from "./findNonAttributes"

const mods = getMod()

const functionHandler = function(data, node, tagIndex, p) {
    p = getPathTo(node);

    tagIndex = getFullPathIndex(p);

    var val = data(tagIndex.join('.'), p);
    if (val && isHTMLEle(val)) {
        // remove childs first
        addToNode(node, val);

        node[MAGNUM] = node[MAGNUM] || {};
        node[MAGNUM].isItem = true;
        node[MAGNUM].dataPass = {
            index: tagIndex
        };

        data.draw && data.draw();
    } else {
        // TODO: is this a valid use case?

        // var type = /<[a-z][\s\S]*>/i.test(val) ? '_html' : '_text'
        // var obj = {}
        // obj[type] = val
        return fillNode(node, val, p);
    }
};

export default function fillNode(node, data, p, key) {
    const innerMods = mods && mods.innerMods
    var attributes;
    var attrValue;

    var element;
    var elements;

    var tagIndex = getPathIndex(p);

    if (data && isHTMLEle(data)) {
        addToNode(node, data);
        return;
    }

    if (typeof data === 'function') {
        // ignore functions
        return functionHandler(data, node, tagIndex, p);
    }

    // if the value is a simple property wrap it in the attributes hash
    if (typeof data !== 'object')
        return fillNode(
            node,
            {
                _text: data
            },
            p
        );

    //TODO: should be a default plugin hookin not just another if
    // check for unloaded inner modules then call unload
    if (innerMods &&
        innerMods[getId()] &&
        data[innerMods[getId()][0]] &&
        !data[innerMods[getId()][0]].draw
    ) {
        // call destroy handler
        innerMods[getId()][1].destroy();
    }
    // find all the attributes
    attributes = findAllAttributes(node, data);

    // fill in all the attributes
    if (attributes) {
        fillAttributes(node, attributes, p, key);
    }

    // look for non-attribute keys and recurse into those elements
    findNonAttributes(node, data, p);
}