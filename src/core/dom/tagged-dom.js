import {doc} from '../constants';
import {isString, isObject, isArray, isHTMLEle, isFunction} from "../utils/common"
import mag from "../mag"
import html2dom from "./html2dom"

/*
Forked from: https://raw.githubusercontent.com/kapouer/dom-template-strings/master/src/index.js
 */

let counter = 0
function generateId () {
    counter++
    return `p-${counter}-${Date.now()}`
}

function applyFuncs(funcs, container, attrNodes) {
    funcs.forEach(item => {

        const nodes = container.querySelectorAll(item.name)

        if (nodes) {
            nodes.forEach(itemNode => {
                const attrs = {}
                for (var i = 0, size = itemNode.attributes.length; i < size; i++) {
                    const attrib = itemNode.attributes[i];
                    //TODO: attributes that are Nodes?
                    //children?
                    attrs[attrib.name] = attrNodes[attrib.value] ? attrNodes[attrib.value] : attrib.value
                }
                var func = getFunc(item.name)
                if (func) {
                    const newNode = func(attrs)

                    itemNode.parentNode.replaceChild(newNode, itemNode)
                }
            })
        }
    })
}

function applyAttrs(placeholders, container) {
    const attrNodes = {}
    // Replace placeholders with real Nodes
    placeholders.forEach(({id, node}) => {
        const placeholder = container.querySelector(`${node.nodeName}#${id}`)
        if (placeholder) {
            placeholder.parentNode.replaceChild(node, placeholder)
        } else {
            attrNodes[id] = node
        }
    })
    return attrNodes;
}

function generateNodes (doc, ...partials) {
    // Array of placeholder IDs
    const placeholders = []
    const funcs = []

    // Generate regular HTML string first
    function reducer(carry, partial) {
        if (partial && partial.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
            partial = partial.childNodes
        }
        if(isString(partial)){
            const parts = partial.split('<');
            parts.forEach(part=>{
                const first = part[0]
                if(first && first == first.toUpperCase() && first != first.toLowerCase()){
                    const name = part.split('/')[0].split(' ')[0].replace('>','')
                    funcs.push({name})
                }
                //TODO: add quotes to attributes missing them?
            })
        }
        if (isArray(partial)) {
            carry.concat(partial)
        } else if (isObject(partial) && isHTMLEle(partial)) {
            const id = generateId()
            placeholders.push({ id, node: partial })
            if(~carry[0].indexOf('=')){ //ATTR
                return carry.concat(`"${id}"`)
            } else {
                return carry.concat(`<${partial.nodeName} id="${id}"></${partial.nodeName}>`)
            }

        } else if (partial && typeof partial.item == "function" && typeof partial.length == "number") {
            return carry.concat(Array.prototype.reduce.call(partial, reducer, []))
        } else {
            return carry.concat(partial)
        }
    }
    const html = partials.reduce(reducer, []).join('').replace(/^\s*</, "<").replace(/>\s*$/, ">")

    // Wrap in temporary container node
    let container = html2dom(html)
    const attrNodes = applyAttrs(placeholders, container);
    applyFuncs(funcs, container, attrNodes);

    let shouldBeFragment = false
    for (var i = 0; i < partials.length; i++) {
        if (partials[i] == "") {
            continue
        } else if (partials[i] instanceof Node) {
            shouldBeFragment = true
            break
        } else {
            break
        }
    }

    if (container.childNodes.length == 1 && !shouldBeFragment) {
        let child = container.firstChild
        container.removeChild(child)
        return child
    } else {
        return container
    }
    return container
}

var getFunc = name => {
    if(_self[name] && isFunction(_self[name])) return _self[name]
    if(mag[name] && isFunction(mag[name])) return mag[name]
}

function taggedTemplateHandler (doc, strings, ...values) {
    // Create an array that puts the values back in their place
    const arr = strings.reduce((carry, current, index) => {
        return carry.concat(current, (index + 1 === strings.length) ? [] : values[index])
    }, [])

    return generateNodes(doc, ...arr)
}

var _self
var sdoc

function dom(strings, ...values){
    _self = global || this || window
    return taggedTemplateHandler(doc, strings, ...values)
}

export default dom