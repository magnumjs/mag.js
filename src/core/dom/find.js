import getParent from "./getParent"
import mag from "../mag"
import html2dom from "./html2dom"
import {runningViewInstance} from "../../module"
import {runningEventInstance} from "../../utils"
import findInSelectors from "./findInSelectors"

const find = function(selector) {
    if (typeof selector == 'string') {
        //if HTMLstring convert to HTML NODE
        if (selector.trim()[0] == '<') {
            var found = html2dom(selector);
            if (found) return found;
        }

        var parentNode = getParent(
            ~runningViewInstance || runningEventInstance
        );
        //5 Element Matchers
        var found = findInSelectors(parentNode || mag.doc, selector);
        if (found) return found;
    }
    return selector;
};

export default find;