import {MAGNUM, doc} from '../../core/constants'
import {removeChildren, reattachChildren} from "./showHide"
import {nodeListToArray, templates, getPath, MAGNUM_KEY, removeNode} from "./common"
import {isArray, isHTMLEle, isUndefined, isObject, isFragment} from "../utils/common"
import fillNode from "./fillNode"
import addToNode from "./addToNode"

// this is the entry point for this module, to fill the dom with data
export default function run(nodeList, data, key) {
    var node, dataIsArray;

    // there is nothing to do if there is nothing to fill
    if (!nodeList) return;

    // remove all child nodes if there is no data
    if (data === null && key) {
        removeChildren(nodeList, key);
    } else if(data === null && !key) {
        nodeList[MAGNUM].detached = 1;
        return removeChildren(nodeList);
    } else
    if (nodeList[MAGNUM] && nodeList[MAGNUM].detached && !key) {
        nodeList[MAGNUM].detached = 0;
        reattachChildren(nodeList);
    }

    // CACHE
    // DIFF
    // CHANGE? then modify only the changes
    // KEYS for indentification

    // nodeList updates as the dom changes, so freeze it in an array
    // var elements = nodeListToArray(isFragment(nodeList) && nodeList.childNodes.length?nodeList.childNodes:nodeList);
    var elements = nodeListToArray(nodeList);


    //data at root that is not an object Map or a string or NULL
    if(!key && isArray(data) && data.length  && data[0] && data[0].nodeType && isFragment(elements[0].parentNode)){
        //loop through all items and attach to Node
        data.forEach((item,key)=>{
            if(item && item.nodeType){
                addToNode(elements[0], item, 1)
            } else {
                if(!elements[key]) {
                     // addToNode(elements[0], elements[0].firstChild.cloneNode(1), 1)
                }
                run(elements[key], item, key + 1)
            }
        })
        return;
    }


    dataIsArray = isArray(data);

    // match the number of nodes to the number of data elements
    if (dataIsArray) {
        if (templates[key] && elements.length === 0) {
            templates[key].parent.insertAdjacentHTML(
                'beforeend',
                templates[key].node
            );
            elements = nodeListToArray(templates[key].parent.childNodes);
        }

        if (!elements.length) {
            // should never reach here
            // cannot fill empty nodeList with an array of data
            return;
        }

        // clone the first node if more nodes are needed
        var parent = elements[0].parentNode;

        if (!templates[key]) {
            templates[key] = {
                node: elements[0].cloneNode(1).outerHTML,
                parent: parent
            }
        }

        var fragment = doc.createDocumentFragment();


        //Adding
        var ii = 0;
        while (elements.length < data.length) {
            if (templates[key] && parent && parent.insertAdjacentHTML) {
                // if(isFragment(parent)){
                //     parent.firstChild.insertAdjacentHTML('afterend', templates[key].node);
                // }else {
                    parent.insertAdjacentHTML('beforeend', templates[key].node);
                // }
                node = parent.lastChild;
            } else {
                node = elements[0].cloneNode(1);
            }

            getPath(node, ++ii, key);

            elements.push(node);
            fragment.appendChild(node);
        }
        // if(isFragment(parent)){
        //     elements.forEach(item=>parent.appendChild(item))
        // } else
        if (parent) {
            parent.appendChild(fragment)
        }

        // loop thru to make sure no undefined keys

        var keys = data.map(function(i) {
            return i && i[MAGNUM_KEY];
        });

        // add keys if equal
        if (elements.length == data.length || keys.indexOf(undefined) !== -1) {
            // changes data can cause recursion!
            data = data.map(function(d, i) {
                if (isObject(d)) {
                    elements[i][MAGNUM] = elements[i][MAGNUM] || {};
                    if (elements[i][MAGNUM].__key && isUndefined(d[MAGNUM_KEY])) {
                        d[MAGNUM_KEY] = elements[i][MAGNUM].__key;
                        return d;
                    }
                    if (isUndefined(d[MAGNUM_KEY])) {
                        d[MAGNUM_KEY] = MAGNUM + i;
                    }
                    elements[i][MAGNUM].__key = d[MAGNUM_KEY];
                }

                return d;
            });
        }
        if (elements.length > data.length) {
            if (data.length === 0 || !isObject(data[0])) {
                while (elements.length > data.length) {
                    node = elements.pop();
                    parent = node.parentNode;
                    if (parent) {
                        removeNode(node);
                    }
                }
            } else {
                // more elements than data
                // remove elements that don't have matching data keys

                var found = [];
                // get all data keys
                var m = data.map(function(i) {
                    return i[MAGNUM_KEY];
                });

                elements = elements.filter(function(ele, i) {
                    var remove;
                    if (isUndefined(ele[MAGNUM])) {
                        remove = 1;
                    } else if (
                        !~m.indexOf(ele[MAGNUM].__key) ||
                        ~found.indexOf(ele[MAGNUM].__key)
                    ) {
                        found.push(ele[MAGNUM].__key);
                        remove = 1;
                    }
                    if (remove) {
                        removeNode(ele);
                        return false;
                    }
                    found.push(ele[MAGNUM].__key);
                    return true;
                });
            }
        }
    }

    // now fill each node with the data
    for (var i = 0; i < elements.length; i++) {
        // create element specific xpath string
        if (dataIsArray) {
            if (elements[i]) {
                run(elements[i], data[i], i);
            }
        } else {
            var p = getPath(elements[i], i + 1, key);
            // var p = getPathTo(elements[i])

            if (
                data &&
                isObject(data) &&
                data.hasOwnProperty(MAGNUM_KEY) &&
                !isHTMLEle(data)
            ) {
                elements[i][MAGNUM].isItem = true;
                elements[i][MAGNUM].dataPass = data;
            }
            fillNode(elements[i], data, p, key);
        }
    }
}