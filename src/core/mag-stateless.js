import {run} from "../fill-stateless"
import find from "./dom/find-stateless"
import {rafBounceIds, _cprops, doc} from './constants';
import mag from "./mag"
import magInit from "./mag-init"

mag._handler = function(idOrNode, mod, dprops) {
    return magInit(idOrNode, mod, dprops, run, find)
};

export {_cprops, rafBounceIds, doc}

export default mag;