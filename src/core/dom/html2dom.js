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

function removeSelfClosingTags(xml) {
    var split = xml.split("/>");
    var newXml = "";
    for (var i = 0; i < split.length - 1;i++) {
        var edsplit = split[i].split("<");
        newXml += split[i] + "></" + edsplit[edsplit.length - 1].split(" ")[0] + ">";
    }
    return newXml + split[split.length-1];
}

export function html (data)
{
    if (isString(data)){

        var trimmed = data.trim()

        if(trimmed[0] == '<') {

            var dom = html2dom(removeSelfClosingTags(trimmed))
            if (dom.childNodes.length == 1)
                return dom.childNodes[0]
            else {
                var nodes = Array.from(dom.childNodes)
                // var fragment = doc.createDocumentFragment();
                var fragment = doc.createElement('fragment');
                nodes.forEach(item => fragment.appendChild(item))
                return fragment
            }
        }
    }
}

export default html2dom