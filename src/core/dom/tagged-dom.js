import {doc} from '../constants';
import {isString, isObject, isArray, isHTMLEle} from "../utils/common"

let counter = 0
function generateId () {
    counter++
    return `p-${counter}-${Date.now()}`
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
                    const name = part.split('/')[0].split(' ')[0]
                    funcs.push({name})
                }
            })
        }
        if (isArray(partial)) {
            carry.concat(partial)
        } else if (isObject(partial) && isHTMLEle(partial)) {
            const id = generateId()
            placeholders.push({ id, node: partial })
            return carry.concat(`<${partial.nodeName} id="${id}"></${partial.nodeName}>`)
        } else if (partial && typeof partial.item == "function" && typeof partial.length == "number") {
            return carry.concat(Array.prototype.reduce.call(partial, reducer, []))
        } else {
            return carry.concat(partial)
        }
    }
    const html = partials.reduce(reducer, []).join('').replace(/^\s*</, "<").replace(/>\s*$/, ">")

    // Wrap in temporary container node
    let template = doc.createElement('template')
    template.innerHTML = html
    let container = template.content

    // Replace placeholders with real Nodes
    placeholders.forEach(({ id, node }) => {
        const placeholder = container.querySelector(`${node.nodeName}#${id}`)
        placeholder.parentNode.replaceChild(node, placeholder)
    })

    funcs.forEach(item => {
        const nodes = container.querySelectorAll(item.name)

        if(nodes) {
            nodes.forEach(itemNode => {
                const attrs = {}
                for (var i = 0, size = itemNode.attributes.length; i < size; i++) {
                    const attrib = itemNode.attributes[i];

                    attrs[attrib.name] = attrib.value
                }
                if (typeof _self[item.name] == 'function') {
                    const newNode = _self[item.name](attrs)

                    itemNode.parentNode.replaceChild(newNode, itemNode)
                }
            })
        }
    })

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


function taggedTemplateHandler (doc, strings, ...values) {
    // Create an array that puts the values back in their place
    const arr = strings.reduce((carry, current, index) => {
        return carry.concat(current, (index + 1 === strings.length) ? [] : values[index])
    }, [])

    return generateNodes(doc, ...arr)
}

var _self

function dom(strings, ...values){
    _self = global || this || window
    return taggedTemplateHandler(doc, strings, ...values)
}

export default dom