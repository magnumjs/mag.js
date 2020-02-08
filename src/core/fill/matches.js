import {getItems, getId, getHook} from "./common"
import {isHTMLEle} from "../utils/common"
import {MAGNUM, _cprops} from '../constants'


const hook = getHook()
const items = getItems()

//===========================================================================
// TODO: Decide if the caching of element matching should be reintroduced.
// The original implementation cached the lookup of elements, but it seems
// like this will only be useful in cases where the same DOM elements are
// getting filled mutliple times -- that seems like it would only happen
// when someone is running performance benchmarks.
//===========================================================================

export function matchingElements(node, key, nested) {
    var elements = childElements(node);
    var matches = [];
    var keyName = key;

    // is this cache necessary good useful?
    // are we losing some dynamism?

    var globalSearch = key[0] === '$';

    if (keyName[0] === '$') {
        // bust cache
        keyName = keyName.substr(1);
    }

    // search all child elements for a match
    for (var i = 0; i < elements.length; i += 1) {
        if (elementMatcher(elements[i], keyName)) {
            matches.push(elements[i]);
        }
    }

    // if there is no match, recursively search the childNodes
    if (!matches.length || globalSearch) {
        for (var i = 0; i < elements.length; i++) {
            // NOTE: pass in a flag to prevent recursive calls from logging
            matches = matches.concat(matchingElements(elements[i], key, true));
            if (matches.length && !globalSearch) break;
        }
    }

    if (!nested && !matches.length && hook) {
        // TODO: mag.hookin for not found matchers
        var data = {
            key: key,
            value: matches,
            node: node
        };
        hook('elementMatcher', key, data);
        //hookin change
        if (data.change) {
            // TODO: return a custom element for unmatched one ?
            matches = data.value;
        }
    }
    return matches;
}


function isInIsolate(node) {


        if (
        getId() &&
        // ((isHTMLEle(getId()) && node[MAGNUM] && node[MAGNUM].scid
        //     && node[MAGNUM].scid != getId()[MAGNUM].scid) || //Stateless
        (node.id && node.id != getId() && items && items.isItem(node.id))
    ) {
        return 0;
    } else {
        return 1;
    }
}



// return just the child nodes that are elements
export function childElements(node) {
    var elements = [];
    if (node) {
        var children = node.childNodes;
        if (children) {
            for (var i = 0; i < children.length; i += 1) {
                if (children[i].nodeType === 1 && isInIsolate(children[i])) {
                    elements.push(children[i]);
                }
            }
        }
    }
    return elements;
}

// match elements on tag, id, name, class name, data-bind, etc.
export function elementMatcher(element, key) {
    var paddedClass = ' ' + element.className + ' ';

    return (
        element.id === key ||
        ~paddedClass.indexOf(' ' + key + ' ') ||
        element.name === key ||
        element.nodeName.toLowerCase() === key.toLowerCase() ||
        element.getAttribute('data-bind') === key
    );
}