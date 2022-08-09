import {doc, nodeCache} from '../constants';

export default function getNode(id, clear) {
  //cache nodes?
  if (nodeCache[id] && !clear) return nodeCache[id];
  var node = doc.getElementById(id);
  if (node) nodeCache[id] = node;
  return nodeCache[id];
}
