import {doc} from "../constants"
import {isString} from "../utils/common"
import {nodeListToArray} from "../fill/common"

const html2dom = html => {
    let template = doc.createElement('template')
    template.innerHTML = html
    //TODO: how about childNodes?
    // return template.content.childNodes
    return template.content
}



export function html (data)
{
    if (isString(data) && data.trim()[0] == '<') {
        var dom= html2dom(data.trim())
        if(dom.childNodes.length == 1) return dom.childNodes[0]
        else {
            var nodes=  nodeListToArray(dom.childNodes)
            var fragment = doc.createDocumentFragment();
            nodes.forEach(item=>fragment.appendChild(item))
            return fragment
        }
    }
}

export default html2dom