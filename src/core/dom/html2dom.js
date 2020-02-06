import {doc} from "../constants"

const html2dom = html => {
    let template = doc.createElement('template');
    template.innerHTML = html;
    return template.content.children[0];
}


export default html2dom;