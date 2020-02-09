import {doc} from "../constants"
import {html} from "./html2dom"
import findInSelectors from "./findInSelectors"
import {isString} from "../utils/common"


const find = function(selector) {

    if (isString(selector)) {
        let found;

        //if HTMLstring convert to HTML NODE
        found = html(selector);
        if (found) return found;

        //5 Element Matchers
        //TODO: search within Node of Component?
        found = findInSelectors(doc, selector);
        if (found) return found;
    }
    return selector;
};

export default find;