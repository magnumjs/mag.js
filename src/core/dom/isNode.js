import {isHTMLEle} from '../utils/common';
import {nodeCache} from '../constants';

let inc = 0;
const isNode = function(id) {
  if (isHTMLEle(id)) {
    // get id if exists or create one
    if (!id.id) id.id = ++inc;
    //Add to cache for access via getNode(id)
    nodeCache[id.id] = id;
    id = id.id;
  }
  return id;
};

export default isNode;
