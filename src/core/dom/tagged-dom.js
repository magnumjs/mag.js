import {doc, MAGNUM} from '../constants';
import {isString, isObject, isArray, isFunction} from "../utils/common"
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

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function addChildrenAttrs(itemNode, attrNodes){

    if(!itemNode.innerHTML) return {}

    //Child as function?

    //loop thru to add props
    const frags =  html2dom(itemNode.innerHTML)

    const arr = Array.from(frags.childNodes)
    arr.forEach((item, index)=>{
        if(item.tagName) {
            arr[index].func = getFunc(capitalizeFirstLetter(item.tagName.toLowerCase()))
        }
        if(itemNode.childNodes[index][MAGNUM]) {
            arr[index].props = itemNode.childNodes[index][MAGNUM].props
        } else {
            arr[index].props = {}
            getAttrs(itemNode.childNodes[index], arr[index].props, attrNodes)
        }
    })
    return {children: arr}

}

function getAttrs(itemNode, attrs, attrNodes) {
    if(itemNode.attributes) {
        for (var i = 0, size = itemNode.attributes.length; i < size; i++) {
            const attrib = itemNode.attributes[i];
            //TODO: attributes that are Nodes?
            //children?
            attrs[attrib.name] = attrNodes[attrib.value] ? attrNodes[attrib.value] : attrib.value
        }
    }
}

function applyFuncs(funcs, container, attrNodes) {
    funcs.forEach(item => {

        const nodes = container.querySelectorAll(item.name)

        if (nodes) {
            nodes.forEach(itemNode => {

                const attrs = addChildrenAttrs(itemNode, attrNodes)
                getAttrs(itemNode, attrs, attrNodes);

                var func = getFunc(item.name)

                if (func) {
                    //TODO: Auto add keys to unique instances?
                    if(!attrs.key && func.props){
                        attrs.key = ++counter
                    }
                    const newNode = func(attrs)
                    itemNode.parentNode.replaceChild(newNode, itemNode)
                }
            })
        }
    })
}

function getElementsByText(noder, str, tag = '*') {
    return Array.from(noder.querySelectorAll(tag))
        .find(el => el.textContent === str);
}

function applyAttrs(placeholders, container) {
    const attrNodes = {}
    // Replace placeholders with real Nodes
    placeholders.forEach(({id, func, node}) => {
        if(func){
            attrNodes[id] = func
        } else {
            let placeholder = container.querySelector(`${node.nodeName}#${id}`)
            if (!placeholder) {
                var temp = getElementsByText(container, `"${id}"`)
                if (temp) {
                    temp.replaceChild(node, temp.childNodes[0])
                    return attrNodes
                }
            }
            if (placeholder) {
                placeholder.parentNode.replaceChild(node, placeholder)
            } else {
                attrNodes[id] = node
            }
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

            if (isObject(partial) && partial instanceof Node) {
            const id = generateId()
            placeholders.push({id, node: partial})
            if (~carry[0].indexOf('=') && !carry[1]) { //ATTR
                return carry.concat(`"${id}"`)
            } else {
                return carry.concat(`<${partial.nodeName} id="${id}"></${partial.nodeName}>`)
            }

        } else if(isObject(partial)) {

                if (~carry[0].indexOf('=')) {
                    const id = generateId()
                    placeholders.push({id, func: partial})
                    return carry.concat(`"${id}"`)
                } else {

                }

        } else
            if (partial && isFunction(partial.item) && typeof partial.length == "number") {
            return carry.concat(Array.prototype.reduce.call(partial, reducer, []))
        } else {
            return carry.concat(partial)
        }
    }
    const html = partials.reduce(reducer, []).join('').replace(/^\s*</, "<").replace(/>\s*$/, ">")

    // Wrap in temporary container node
    let container = html2dom(`<fragment>
${html.replace(/\>[\r\n ]+\</g, "><")}
</fragment>`)

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

}

var getByName = name => {
    //TODO: case insensitivity, sub like window.todos.CompName
    if(_self[name] && isFunction(_self[name])) return _self[name]
    if(mag[name] && isFunction(mag[name])) return mag[name]
}
var getFunc = name => {
    var func = getByName(name)
    if(func) return func
    //check lowercase
    return getByName(name.toLowerCase())
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