import getParent from "./getParent"
import mag from "../mag"
import {html} from "./html2dom"
import {runningViewInstance} from "../../module"
import {runningEventInstance} from "../../utils"
import findInSelectors from "./findInSelectors"
import {isString} from "../utils/common"

const find = function(selector) {
    if (isString(selector)) {
        //if HTMLstring convert to HTML NODE
        found = html(selector);
        if (found) return found;

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