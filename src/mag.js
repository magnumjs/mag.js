import mag from "./core/mag-state"
import getNode from "./core/dom/getNode"
import {
    getModId,
    clear,
    submodule,
    getState,
} from "./module"
import {removeNode, cached, clearCache} from "./fill"
import {callLCEvent, onLCEvent} from "./core/utils/events"
import {copy, toJson} from "./core/utils/common"
import {items, getItemInstanceId} from "./utils"
import makeClone from "./core/makeClone"
import isNode from "./core/dom/isNode"
import redraw, {pendingRequests} from "./core/draw/redraw"
import {observer, willloader, didloader} from "./core/draw/run"
import hook, {hookin} from "./core/hook"

mag.hook = hook
mag.hookin = hookin
mag.redraw = redraw

mag.begin = function(id) {
    if (typeof pendingRequests[id] == 'undefined') {
        pendingRequests[id] = 1;
    } else {
        pendingRequests[id]++;
    }
};

mag.end = function(id) {
    if (pendingRequests[id] > 1) pendingRequests[id]--;
    else {
        pendingRequests[id] = 0;
        var nid = items.getItemVal(id);
        redraw(getNode(nid), id);
    }
};

var uniqueInstance = function(id, key) {
  // get unique instance ID if not exists or with props.key
  var idInstance;
  var item = key ? id + '-' + key : id;
  // get unique instance ID if not exists or with props.key
  if (items.isItem(item)) {
    idInstance = items.getItem(item);
  } else {
    idInstance = getItemInstanceId(item);
  }
  return idInstance;
};

mag.module = function(id, mod, props) {
  props = props || {};

  //Allow for dom elements to be passed instead of string IDs
  id = isNode(id);

  // already here before?
  //REMOVED reloader life cycle, unless Use Case?

  var idInstance = uniqueInstance(id, props.key);

  var node = setup(props, idInstance, mod, id);
  if (!node) return;

  //TODO: remove! uneccessarily complex!
  //TODO: return ONLY the instance not a cloning device!
  // return function to create new clone instances ;)
  return makeClone(idInstance, node, mod, copy(props));
};

var setup = function(props, idInstance, module, id) {
  // TODO: cache/ clearable
  // clear cache if exists
  if (!props.retain) clear(idInstance);

  // NODE
  var node = getNode(id);

  // get unique instance ID's module
  submodule(id, idInstance, module, props)

  //WATCH
  observer(idInstance, id);

  // LIFE CYCLE EVENT
  if (willloader(idInstance, node)) return;

  // DRAW async
  // DRAW async
  redraw(node, idInstance, 1).then(function() {
    didloader(idInstance, node);
  });

  return node;
};




var prevState = [],
  handlers = [];

var destroyerHandler = function(ids, clones, remove) {
  var node = mag.getNode(getModId(ids));
  var onremove = function() {
    //destroy node

    //callback config unloaders etc...
    if (callLCEvent('onunload', getState(ids), node, ids))
      return;
    mag.clear(ids);
    // call unloaders
    callUnloaders(ids, node);

    if (clones[ids]) {
      // remove clones?
      clones[ids].length = 0;
    }
    if (remove) {
      removeNode(node);
      remove(ids);
    }
  };
  //chek if onbeforeunload exists
  if (getState(ids).onbeforeunload) {
    //call first
    //TODO: call children nodes with hooks too
    callLCEvent(
      'onbeforeunload',
      getState(ids),
      node,
      ids,
      0,
      function() {
        onremove();
      }
    );
  } else {
    onremove();
  }
};

var subscriberHandler = function(ids, handler) {
  //collect handlers
  handlers[ids] = handlers[ids] || [];
  var size = handlers[ids].push(handler);

  // call handler on each new change to state or props
  onLCEvent('didupdate', ids, function(state, props) {
    var current = toJson([props, state]);

    // if (current != prevState[ids]) {}
    for (var handle of handlers[ids]) {
      handle(
        state,
        props,
        getNode(getModId(ids)),
        JSON.parse(prevState[ids] || '[]')
      );
    }

    prevState[ids] = current;
  });
  //return `dispose` function to remove handler
  return function() {
    return handlers[ids].splice(size - 1, 1);
  };
};



mag.clear = function(index) {
  //TODO: Remove from schedule batch?
  // cancelAnimationFrame(timers[index]);
  // remove from indexes
  items.removeItem(index);
  //remove(index)
  clear(index);
  //observer index ?
  // fill data cache
  clearCache(getModId(index));
};




var addConfigUnloaders = function(id, index) {
  var arr = [];

  for (var k in cached) {
    if (
      k.indexOf('id("' + id + '")/') > -1 &&
      k.indexOf('-config') > -1 &&
      cached[k].configContext
    ) {
      arr.push({
        path: k.split('-config')[0],
        controller: cached[k].configContext,
        handler: cached[k].configContext.onunload
      });
    }
  }
  return arr;
};

var callUnloaders = function(index, node) {
  // add configs unloaders
  var arr = addConfigUnloaders(node.id, index);

  for (
    var i = 0, unloader, objects = arr;
    (unloader = objects && objects[i]);
    i++
  ) {
    if (unloader.controller.onunload) {
      unloader.handler.call(unloader.controller, node, unloader.path);
      unloader.controller.onunload = 0;
    }
  }
}

mag.getNode = getNode;

export default mag;
