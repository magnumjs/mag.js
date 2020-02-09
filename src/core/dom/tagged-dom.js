import {doc} from '../constants';

let counter = 0
function generateId () {
    counter++
    return `p-${counter}-${Date.now()}`
}

function generateNodes (doc, ...partials) {
    // Array of placeholder IDs
    const placeholders = []
    // Generate regular HTML string first
    function reducer(carry, partial) {
        if (partial && partial.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
            partial = partial.childNodes
        }
        if (Array.isArray(partial)) {
            carry.concat(partial)
        } else if (typeof partial === 'object' && partial instanceof Node) {
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


const dom= (strings, ...values)  =>{
    return taggedTemplateHandler(doc, strings, ...values)
}

export default dom