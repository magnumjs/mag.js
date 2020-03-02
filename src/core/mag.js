import {rafBounceIds, _cprops, doc} from './constants';
import dom from "./dom/tagged-dom"

const mag = function(idOrNode, mod, dprops) {
    if(idOrNode.raw) {
        return dom.apply(this, arguments)
    }
   return mag._handler(idOrNode, mod, dprops)
}

mag._handler = ()=>{}

//TODO: necessary?
// mag.dom = dom
mag.rafBounceIds = rafBounceIds
mag._cprops = _cprops

// set document
mag.doc = doc;

global.Mag = mag
export {_cprops, rafBounceIds, doc}

export default mag;