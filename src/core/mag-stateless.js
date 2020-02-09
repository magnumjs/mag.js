import {run} from "../fill-stateless"
import find from "./dom/find-stateless"
import {rafBounceIds, _cprops, doc} from './constants';
import mag from "./mag"
import magInit from "./mag-init"
import dom from "./dom/tagged-dom"

mag._handler = function(idOrNode, mod, dprops) {
    return magInit(idOrNode, mod, dprops, run, find)
};


mag.dom = dom

export {_cprops, rafBounceIds, doc}

export default mag;