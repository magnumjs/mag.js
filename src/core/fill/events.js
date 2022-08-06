import {MAGNUM, doc} from '../constants';
import {isString} from '../utils/common';
import {
  getPathTo3,
  getPathId,
  getPathTo4,
  getId,
  getPathTo2,
  setId,
  getItems,
  findParentChild,
  getPathIndex,
  getMod,
  getDraw
} from './common';

const magRedraw = getDraw();
const items = getItems();
const mods = getMod();

function createEventCall(node, fun) {
  var eventCall = function(fun, node, e) {
    //TODO: why not cache xpath?
    var xpath = getPathTo3(node);
    var id = getPathId(xpath);

    if (!id) {
      id = getPathTo4(node);
    }

    var pfillId = getId();
    setId(id);

    var dataParent = findParentChild(node),
      path = dataParent && getPathTo2(dataParent),
      parentIndex = getPathIndex(path),
      xpath = xpath,
      tagIndex = getPathIndex(xpath),
      parent = {
        path: path,
        node: dataParent,
        data: ((dataParent || {})[MAGNUM] || []).dataPass,
        index: parentIndex
      };
    setId(pfillId);
    var nodee = doc.getElementById(id);
    var instanceId = items && items.getItem(id);

    // What if ret is a promise?
    var ret = fun.call(
      ~instanceId && mods ? mods.getMod(instanceId) : nodee,
      e,
      tagIndex,
      node,
      parent
    );
    if (id && nodee) {
      var redraw = function() {
        magRedraw(nodee, instanceId, 1);
      };
      if (ret && ret.then) {
        //Node outdated?
        ret.then(function(res) {
          redraw();
          return res;
        });
      } else {
        redraw();
      }
    }

    return ret;
  }.bind({}, fun, node);

  return eventCall;
}

//Dynamic listeners without event delegation
function attachEvent(node, eventName) {
  function event(e) {
    var handlers = node[MAGNUM]['eventHandlers'][eventName];
    //get all uniue node specific events and run them
    for (var path in handlers) {
      var fun = handlers[path];
      var hand = createEventCall(node, fun);
      var ret = hand(e);
      if (ret === false) e.preventDefault();
    }
  }
  node.removeEventListener(eventName, event);
  node.addEventListener(eventName, event);
}

export function makeEvent(event, attrName, node, parentKey) {
  var eventName = attrName.substr(2).toLowerCase();

  node[MAGNUM] = node[MAGNUM] || {};

  var uid =
    (isString(parentKey) ? parentKey.split('/')[0] : '') +
    '-' +
    node[MAGNUM].uid;
  var events = (node[MAGNUM].events = node[MAGNUM].events || []);
  var eventHandlers = (node[MAGNUM].eventHandlers =
    node[MAGNUM].eventHandlers || []);
  eventHandlers[eventName] = eventHandlers[eventName] || [];
  eventHandlers[eventName][uid] = event;

  if (!events[eventName]) {
    events[eventName] = 1;
    attachEvent(node, eventName);
  }
}
