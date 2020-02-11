import {doc} from "../constants"
import {isString} from "../utils/common"

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
        return html2dom(data).children[0]
    }
}

export default html2dom