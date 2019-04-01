var KEY = 'KEY',
  inc = 0;
var selectors = ['#' + KEY, '.' + KEY, KEY];
var findInSelectors = function(node, key) {
  var found;
  //methods to search
  for (var k in selectors) {
    var search = selectors[k].replace(KEY, key);
    found = node.querySelector(search);
    if (found) break;
  }
  return found;
};

var getParent = function(instanceID) {
  var parentID = mag.utils.items.getItemVal(instanceID);
  var parentNode = mag.getNode(parentID);
  return parentNode;
};

const html2dom = html => {
  let template = mag.doc.createElement('template');
  template.innerHTML = html;
  return template.content.children[0];
};

var find = function(selector) {
  if (typeof selector == 'string') {
    //if HTMLstring convert to HTML NODE
    if (selector.trim()[0] == '<') {
      var found = html2dom(selector);
      if (found) return found;
    }
    var parentNode = getParent(
      ~mag.mod.runningViewInstance || mag.utils.runningEventInstance
    );
    //5 Element Matchers
    var found = findInSelectors(parentNode || mag.doc, selector);
    if (found) return found;
  }
  return selector;
};

var runFun = function(idOrNode, mod, dprops) {
  var clones = [],
    clone = idOrNode.cloneNode(1),
    cache = [],
    last = [],
    runId,
    copyOfDefProps = [];

  var a = function(props) {
    var node = idOrNode;
    props = props || {};
    var key;
    if (props.key !== undefined) key = props.key + '-' + a.id;
    var ckey = props.key !== undefined ? props.key + '-' + a.id : a.id;

    if (!copyOfDefProps[ckey]) {
      copyOfDefProps[ckey] =
        typeof dprops == 'object' ? mag.utils.copy(dprops) : dprops;
    }

    // retrieve props & merge
    if (typeof props == 'object') {
      props = mag.utils.extend(copyOfDefProps[ckey], props);
    }
    if (key && !clones[key]) {
      node = clones[key] = clone.cloneNode(1);
    } else if (key && clones[key]) {
      node = clones[key];
    }

    //Block recursivity
    if (runId && runId == node[MAGNUM].scid) {
      throw Error('MagJS Error - recursive call:' + runId);
    }

    node[MAGNUM] = node[MAGNUM] || {};

    if (mag._cprops[ckey] && typeof props == 'object') {
      props.children = mag._cprops[ckey];
    }

    a.props = props;
    a.key = ckey;
    var now;
    if (last[ckey] != mag.utils.toJson(props)) {
      try {
        var _current = mag._current;
        mag._current = a;
        now = mod(props);
        runId = node[MAGNUM].scid = ckey;
        last[ckey] = mag.utils.toJson(props);
        var pfillId = mag.fill.id;
        //TODO: find parent
        if (pfillId && pfillId[MAGNUM] && pfillId[MAGNUM].scid) {
          node[MAGNUM].pscid = pfillId[MAGNUM].scid;
        }
        mag.fill.setId(node);
        mag.fill.run(node, now);
      } finally {
        mag.fill.setId(pfillId);
        runId = 0;
        mag._current = _current;
      }
    }

    return node;
  };
  a.id = ++inc;
  a.element = clone;

  return a;
};

const mag = function(idOrNode, mod, dprops) {
  idOrNode = find(idOrNode);
  mod = find(mod);
  dprops = dprops || {};

  if (mag.utils.isHTMLEle(mod) && mag.utils.isHTMLEle(idOrNode)) {
    //attach to node once
    if (!mod[MAGNUM]) {
      //Add to scheduleFlush, nextTick?
      mag.fill.run(mod, idOrNode);
    }
  }
  //If mod is a function?
  else if (typeof mod == 'function' && mag.utils.isHTMLEle(idOrNode)) {
    // fake run with no output
    try {
      runFun(idOrNode.cloneNode(1), mod, dprops)()
    } catch (e) {}

    return runFun(idOrNode, mod, dprops);
  } else {
    return makeClone(-1, getNode(mag._isNode(idOrNode)), mod, dprops);
  }
};
var MAGNUM = '__magnum__';
mag.MAGNUM = MAGNUM;
mag.rafBounceIds = [];
mag._cprops = [];
// set document

mag.doc = document;

//Plugins:
var hookins = {
  values: [],
  attributes: [],
  elementMatcher: []
};
var nodeCache = [];

var inc = 0;
mag._isNode = function(id) {
  if (mag.utils.isHTMLEle(id)) {
    // get id if exists or create one
    if (!id.id) id.id = ++inc;
    //Add to cache for access via getNode(id)
    nodeCache[id.id] = id;
    id = id.id;
  }
  return id;
};

var uniqueInstance = function(id, key) {
  // get unique instance ID if not exists or with props.key
  var idInstance;
  var item = key ? id + '-' + key : id;
  // get unique instance ID if not exists or with props.key
  if (mag.utils.items.isItem(item)) {
    idInstance = mag.utils.items.getItem(item);
  } else {
    idInstance = mag.utils.getItemInstanceId(item);
  }
  return idInstance;
};

mag.module = function(id, mod, props) {
  props = props || {};

  //Allow for dom elements to be passed instead of string IDs
  id = mag._isNode(id);

  // already here before?
  //REMOVED reloader life cycle, unless Use Case?

  var idInstance = uniqueInstance(id, props.key);

  var node = setup(props, idInstance, mod, id);
  if (!node) return;

  //TODO: remove! uneccessarily complex!
  //TODO: return ONLY the instance not a cloning device!
  // return function to create new clone instances ;)
  return makeClone(idInstance, node, mod, mag.utils.copy(props));
};

var setup = function(props, idInstance, mod, id) {
  // TODO: cache/ clearable
  // clear cache if exists
  if (!props.retain) mag.mod.clear(idInstance);

  // NODE
  var node = getNode(id);

  // get unique instance ID's module
  mag.mod.submodule(id, idInstance, mod, props);

  //WATCH
  observer(idInstance, id);

  // LIFE CYCLE EVENT
  if (willloader(idInstance, node)) return;

  // DRAW async
  // DRAW async
  mag.redraw(node, idInstance, 1).then(function() {
    didloader(idInstance, node);
  });

  return node;
};

var isValidId = function(nodeId, idInstance) {
  // verify idInstance
  if (idInstance < 0 || idInstance != mag.utils.items.getItem(nodeId)) {
    // if original id is a match
    if (nodeId == mag.mod.getId(idInstance)) return true;
    return false;
  }
  return true;
};

var pendingRequests = [];

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
    var nid = mag.utils.items.getItemVal(id);
    mag.redraw(getNode(nid), id);
  }
};
// var timers = [];
mag.redraw = function(node, idInstance, force) {
  if (!pendingRequests[idInstance]) {
    if (!node || typeof idInstance == 'undefined') {
      throw Error(
        'Mag.JS - Id or node invalid: ' + mag.utils.items.getItemVal(idInstance)
      );
    }

    // verify idInstance
    if (!isValidId(node.id, idInstance)) {
      // reschedule?
      return {
        then: cb => cb()
      };
    }

    // clear existing configs ?
    // TODO: per idInstance / id ?
    if (force) mag.fill.configs.splice(0, mag.fill.configs.length);

    if (force) mag.mod.clear(idInstance);

    if (mag.mod.runningViewInstance == idInstance) {
      throw Error('Mag.JS - recursive call:' + idInstance);
    }

    // check for existing frame id then clear it if exists
    //ENQUEUE
    //debounce

    // console.time(node.id)
    //returns promise
    return mag.utils.scheduleFlush(
      idInstance,
      makeRedrawFun(node, idInstance, force)
    );
    // .then(() => console.timeEnd(node.id))
    //save frame id with the instance
    // then if instance already has frame id create new discard old or just retain old
  }
};

mag.hookin = function(name, key, handler) {
  hookins[name].push({
    context: {},
    handler: handler,
    key: key
  });
};

mag.hook = function(name, key, data) {
  for (var i = 0, size = hookins[name].length; i < size; i++) {
    mag.utils.callHook(hookins, key, name, i, data);
  }
};

var cloners = {},
  prevState = [],
  handlers = [];

var destroyerHandler = function(ids, clones, remove) {
  var node = mag.getNode(mag.mod.getId(ids));
  var onremove = function() {
    //destroy node

    //callback config unloaders etc...
    if (mag.utils.callLCEvent('onunload', mag.mod.getState(ids), node, ids))
      return;
    mag.clear(ids);
    // call unloaders
    callUnloaders(ids, node);

    if (clones[ids]) {
      // remove clones?
      clones[ids].length = 0;
    }
    if (remove) {
      mag.fill.removeNode(node);
      mag.mod.remove(ids);
    }
  };
  //chek if onbeforeunload exists
  if (mag.mod.getState(ids).onbeforeunload) {
    //call first
    //TODO: call children nodes with hooks too
    mag.utils.callLCEvent(
      'onbeforeunload',
      mag.mod.getState(ids),
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
  mag.utils.onLCEvent('didupdate', ids, function(state, props) {
    var current = mag.utils.toJson([props, state]);

    // if (current != prevState[ids]) {}
    for (var handle of handlers[ids]) {
      handle(
        state,
        props,
        getNode(mag.mod.getId(ids)),
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

var clones = [];

var run = function(cloner, id, props2, mod, clear) {
  var ids = mag.utils.items.getItem(id);
  id = mag._isNode(cloner);

  var prev = mag.utils.toJson(mag.mod.getProps(ids));

  didloader(ids, cloner);

  if (mag.mod.exists(ids)) {
    if (
      mag.utils.callLCEvent(
        'willgetprops',
        mag.mod.getState(ids),
        cloner,
        ids,
        0,
        props2
      )
    )
      return;
  }

  mag.mod.submodule(cloner.id, ids, mod, props2);

  //attach props to the clone
  if (prev != mag.utils.toJson(mag.mod.getProps(ids))) {
    clear = 1;
  }

  observer(ids, cloner.id);

  if (willloader(ids, cloner)) return;

  // DRAW, return Promise
  mag.redraw(cloner, ids, clear).then(function() {
    //DIDLOAD?
    didloader(ids, cloner);
  });
};

var makeClone = function(idInstance, node, mod, props) {
  // recursion warning
  clones[idInstance] = clones[idInstance] || [];
  var a = function(ids, node, mod, props2, index) {
    //TODO: what is this use case? if no index?
    if (typeof index == 'object') {
      props2 = mag.utils.merge(mag.utils.copy(props2), index);
      index = 0;
    }

    if (ids < 0 && !index) {
      index = 1;
    }

    // prevent recursion?
    var id =
      node.id + (props2.key ? '.' + props2.key + '.' : '') + (index || '');

    //TODO: add key when props key not used?
    if (cloners[id] && !props2.key && !~a._id) {
      id += ++inc;
    }

    var cloner = (cloners[id] = cloners[id] || node.cloneNode(1));
    cloner.id = id;
    // if clone already exists return & rerun draw ?
    if (mag.utils.items.isItem(id)) {
      // call redraw on
      // get unique instance ID's module
      run(cloner, id, props2, mod);
      return cloner;
    }

    var idInstance2 = mag.utils.getItemInstanceId(cloner.id);
    if (ids < 0) {
      //call will and did load events
      ids = a._id = idInstance2;
      // repeated similar clones?
      // Check if instanceId in clones already?
    } else {
      clones[ids].push({
        instanceId: idInstance2,
        //id: cloner.id, // TODO: remove, use mag.getId(instanceId)
        subscribe: subscriberHandler.bind({}, idInstance2)
      });
    }

    // get unique instance ID's module
    run(cloner, id, props2, mod);
    return cloner;
  }.bind({}, idInstance, node, mod, props);

  //BIND CLONE INSTANCE METHODS

  a._id = idInstance;
  a.clones = function() {
    return clones[a._id];
  };

  //TODO: implement
  a.destroy = function(remove) {
    destroyerHandler(a._id, a.clones, remove);
  };
  a.getId = function() {
    return a._id;
  };
  a.rafBounce = function(bounce) {
    if (bounce) {
      //add
      mag.rafBounceIds[a._id] = 1;
    } else if (bounce === false) {
      //remove
      mag.rafBounceIds[a._id] = 0;
    }
    return mag.rafBounceIds[a._id] ? true : false;
  };
  a.draw = function(force) {
    return mag.redraw(node, a._id, force);
  };
  a.getState = function() {
    return mag.mod.getState(a._id);
  };
  a.getProps = function() {
    return mag.mod.getProps(a._id);
  };
  a.subscribe = function(handler) {
    return subscriberHandler(a._id, handler);
  };

  return a;
};

function getNode(id, clear) {
  //cache nodes?
  if (nodeCache[id] && !clear) return nodeCache[id];
  var node = mag.doc.getElementById(id);
  if (node) nodeCache[id] = node;
  return nodeCache[id];
}

var observer = function(idInstance, nodeId) {
  var callback = function(index, id) {
    if (getNode(id)) {
      mag.redraw(getNode(id), index);
    } else if (mag.utils.items.isItem(id)) {
      mag.clear(index);
      //throw Error('invalid node id ' + id + ' index ' + index)
    }
  }.bind({}, idInstance, nodeId);
  mag.mod.setFrameId(idInstance, callback);
};

mag.clear = function(index) {
  //TODO: Remove from schedule batch?
  // cancelAnimationFrame(timers[index]);
  // remove from indexes
  mag.utils.items.removeItem(index);
  //mag.mod.remove(index)
  mag.mod.clear(index);
  //observer index ?
  // fill data cache
  mag.fill.clearCache(mag.mod.getId(index));
};

var makeRedrawFun = function(node1, idInstance1, force1) {
  return function(node, idInstance, force) {
    // clear node cache new run
    getNode(node.id, 1);

    // verify idInstance
    if (!isValidId(node.id, idInstance) || !node) {
      return;
    }

    var state = mag.mod.getState(idInstance);

    // LIFE CYCLE EVENT
    if (mag.utils.callLCEvent('isupdate', state, node, idInstance)) return;

    // CACHED?
    if (mag.mod.iscached(idInstance) && !force) {
      return 0;
    }

    // LIFE CYCLE EVENT
    if (mag.utils.callLCEvent('willupdate', state, node, idInstance)) return;

    //RUN VIEW FUN
    mag.mod.callView(node, idInstance);

    // var active = mag.doc.activeElement

    //START DOM
    var pfillId = mag.fill.id;
    mag.fill.setId(node.id);
    mag.fill.run(node, state);
    mag.fill.setId(pfillId);

    // END DOM

    // if (mag.doc.activeElement !== active) active.focus()

    //CONFIGS
    callConfigs(node.id, mag.fill.configs);

    // LIFE CYCLE EVENT
    mag.utils.callLCEvent('didupdate', state, node, idInstance);

    //reset cache
    if (!force) mag.mod.iscached(idInstance);
  }.bind({}, node1, idInstance1, force1);
};

var callConfigs = function(id, configs) {
  for (var k in configs) {
    if (k.startsWith('id("' + id + '")/')) {
      configs[k]();
    }
  }
};

var addConfigUnloaders = function(id, index) {
  var arr = [];

  for (var k in mag.fill.cached) {
    if (
      k.indexOf('id("' + id + '")/') > -1 &&
      k.indexOf('-config') > -1 &&
      mag.fill.cached[k].configContext
    ) {
      arr.push({
        path: k.split('-config')[0],
        controller: mag.fill.cached[k].configContext,
        handler: mag.fill.cached[k].configContext.onunload
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
};

var willloader = function(idInstance, node) {
  return mag.utils.callLCEvent(
    'willload',
    mag.mod.getState(idInstance),
    node,
    idInstance,
    1
  );
};

var didloader = function(idInstance, node) {
  // only if attached
  var id = mag.utils.items.getItemVal(idInstance);
  if (getNode(id) && mag.mod.exists(idInstance)) {
    return mag.utils.callLCEvent(
      'didload',
      mag.mod.getState(idInstance),
      node,
      idInstance,
      1
    );
  }
};

mag._find = function(element, key) {
  var pfillId = mag.fill.id;
  mag.fill.setId(element);
  // only for user input fields
  var found = mag.fill.find(element, key);
  mag.fill.setId(pfillId);

  return found;
};

mag.getNode = getNode;

export default mag;
