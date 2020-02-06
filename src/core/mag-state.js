import {run} from "../fill"
import find from "./dom/find"
import makeClone from "./makeClone"
import mag from "./mag"
import getNode from "./dom/getNode"
import isNode from "./dom/isNode"
import magInit from "./mag-init"

mag._handler = function(idOrNode, mod, dprops) {
    const lastCall = (idOrNode, mod, dprops) => makeClone(-1, getNode(isNode(idOrNode)), mod, dprops)
    return magInit(idOrNode, mod, dprops, run, find, lastCall)
};

export default mag;