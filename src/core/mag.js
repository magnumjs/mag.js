import {rafBounceIds, _cprops, doc} from './constants';

const mag = function(idOrNode, mod, dprops) {
   return mag._handler(idOrNode, mod, dprops)
};

mag._handler = ()=>{}

mag.rafBounceIds = rafBounceIds
mag._cprops = _cprops
// set document

mag.doc = doc;


export {_cprops, rafBounceIds, doc}

export default mag;