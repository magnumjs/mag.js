import {doc} from "../constants"
import html2dom from "./html2dom"
import findInSelectors from "./findInSelectors"


const find = function(selector) {
    if (typeof selector == 'string') {
        //if HTMLstring convert to HTML NODE
        if (selector.trim()[0] == '<') {
            var found = html2dom(selector);
            if (found) return found;
        }


        //5 Element Matchers
        var found = findInSelectors(doc, selector);
        if (found) return found;
    }
    return selector;
};

export default find;