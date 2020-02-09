import {doc} from "../constants"
import html2dom from "./html2dom"
import findInSelectors from "./findInSelectors"


const find = function(selector) {
    if (typeof selector == 'string') {
        let found;

        //if HTMLstring convert to HTML NODE
        if (selector.trim()[0] == '<') {
            found = html2dom(selector);
            if (found) return found;
        }


        //5 Element Matchers
        try{
            found = findInSelectors(doc, selector);
        } catch(e) {}
        if (found) return found;
    }
    return selector;
};

export default find;