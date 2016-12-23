/*
MagJS v0.24.6
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(global, document, undefined) {

  'use strict';

  global.mag = {};

  // set document

  mag.doc = document;

  //Plugins:
  var hookins = {
    values: [],
    attributes: [],
    elementMatcher: []
  };
  var nodeCache = [];

  mag.create = function(id, module, props) {
    return function(id2, props2) {
      if (typeof id2 !== 'string') {
        props2 = id2
        id2 = 0
      }
      return mag.module(id2 || id, module, mag.utils.merge(props || {}, props2 || {}))
    }
  }

  mag.module = function(id, mod, props) {

    props = props || {}

    //Allow for dom elements to be passed instead of string IDs
    if (id instanceof HTMLElement) {
      // get id if exists or create one
      if (!id.id) id.id = performance.now();
      //Add to cache for access via getNode(id)
      nodeCache[id.id] = id;
      id = id.id;
    }

    // already here before?
    if (mag.utils.items.isItem(id)) {
      if (reloader(mag.utils.items.getItem(id), getNode(id))) return;
    }


    // get unique instance ID if not exists or with props.key
    var idInstance;
    // get unique instance ID if not exists or with props.key
    if (props.key && mag.utils.items.isItem(id + '.' + props.key)) {
      idInstance = mag.utils.items.getItem(id + '.' + props.key)
    } else {
      idInstance = mag.utils.getItemInstanceId(props.key ? id + '.' + props.key : id);
    }

    // TODO: cache/ clearable
    // clear cache if exists
    if (!props.retain) mag.mod.clear(idInstance)

    // get unqiue instance ID's module
    mag.mod.submodule(id, idInstance, mod, props)

    // NODE
    var node = getNode(id)

    //WATCH
    observer(idInstance, id)

    // LIFE CYCLE EVENT
    if (mag.utils.callLCEvent('willload', mag.mod.getState(idInstance), node, idInstance, 1)) return;

    // DRAW async
    mag.redraw(node, idInstance, 1);

    // LIFE CYCLE EVENT
    mag.utils.callLCEvent('didload', mag.mod.getState(idInstance), node, idInstance, 1);

    // return function to clone create new clone instances ;)
    return makeClone(idInstance, node, mod, mag.utils.copy(props))
  }

  var isValidId = function(nodeId, idInstance) {

    // verify idInstance
    if (idInstance < 0 || idInstance != mag.utils.items.getItem(nodeId)) {
      // if original id is a match
      if (nodeId == mag.mod.getId(idInstance)) return true;
      return false
    }
    return true
  }

  var pendingRequests = []

  mag.begin = function(id) {
    if (typeof pendingRequests[id] == 'undefined') {
      pendingRequests[id] = 1;
    } else {
      pendingRequests[id]++;
    }
  }

  mag.end = function(id) {
    if (pendingRequests[id] > 1) pendingRequests[id]--;
    else {
      pendingRequests[id] = 0;
      var nid = mag.utils.items.getItemVal(id)
      mag.redraw(getNode(nid), id);
    }

  }
  var timers = [];
  mag.redraw = function(node, idInstance, force) {
    if (!pendingRequests[idInstance]) {

      if (!node || typeof idInstance == 'undefined') {
        throw Error('Mag.JS - Id or node invalid: ' + mag.utils.items.getItemVal(idInstance));
      }

      // verify idInstance
      if (!isValidId(node.id, idInstance)) {
        return
      }

      // clear existing configs ?
      // TODO: per idInstance / id ?
      if (force) mag.fill.configs.splice(0, mag.fill.configs.length)

      if (force) mag.mod.clear(idInstance)

      var fun = makeRedrawFun(node, idInstance, force)

      // check for existing frame id then clear it if exists
      //ENQUEUE
      //debounce
      cancelAnimationFrame(timers[idInstance]);
      timers[idInstance] = requestAnimationFrame(fun);
      //save frame id with the instance 
      // then if instance already has frame id create new discard old or just retain old
    }
  }

  mag.hookin = function(name, key, handler) {
    hookins[name].push({
      context: {},
      handler: handler,
      key: key
    })
  }

  mag.hook = function(name, key, data) {
    for (var i = 0, size = hookins[name].length; i < size; i++) {
      mag.utils.callHook(hookins, key, name, i, data);
    }
  }

  var cloners = {},
    prevState = [],
    handler = function(ids, handler) {
      // call handler on each new change to state or props
      mag.utils.onLCEvent('didupdate', ids, function(state, props) {

          var current = mag.utils.merge(mag.utils.copy(props), mag.utils.copy(state));

          if (JSON.stringify(current) !== JSON.stringify(prevState[ids])) {
            handler(state, props, getNode(mag.mod.getId(ids)), prevState[ids]);
            prevState[ids] = current;
          }
        })
        //TODO: return `dispose` function to remove handler
    };

  var clones = [];

  var run = function(cloner, id, props2, mod, clear) {
    var ids = mag.utils.items.getItem(id);
    mag.mod.submodule(cloner.id, ids, mod, props2)

    if (mag.utils.callLCEvent('willgetprops', mag.mod.getState(ids), cloner, ids, 0, props2)) return;


    observer(ids, cloner.id)

    // DRAW
    mag.redraw(cloner, ids, clear);
  };

  var makeClone = function(idInstance, node, mod, props) {
    // recursion warning
    clones[idInstance] = clones[idInstance] || [];
    var a = function(ids, node, mod, props2, index) {
      //TODO: what is this use case? if no index?

      if (typeof index == 'object') {
        props2 = mag.utils.merge(mag.utils.copy(props2) || {}, index);
        index = 0;
      }


      // prevent recursion?
      var id = node.id + (props2.key ? '.' + props2.key : '') + '.' + (index || 0);
      var cloner = cloners[id] = cloners[id] || node.cloneNode(1);
      cloner.id = id;
      // if clone already exists return & rerun draw ?
      if (mag.utils.items.isItem(id)) {
        // call redraw on 
        // get unique instance ID's module
        run(cloner, id, props2, mod, 1);
        return cloner;
      }

      var idInstance2 = mag.utils.getItemInstanceId(cloner.id);

      // repeated similar clones?
      // Check if instanceId in clones already?
      clones[ids].push({
        instanceId: idInstance2,
        //id: cloner.id, // TODO: remove, use mag.getId(instanceId)
        subscribe: handler.bind({}, idInstance2)
      });

      // get unique instance ID's module
      run(cloner, id, props2, mod, 1);

      return cloner;

    }.bind({}, idInstance, node, mod, props)


    //BIND CLONE INSTANCE METHODS

    a.clones = function(ids) {
      return clones[ids]
    }.bind({}, idInstance);

    //TODO: implement
    a.destroy = function(ids, remove) {
      var node = mag.getNode(mag.mod.getId(ids));
      var onremove = function() {
        //destroy node

        //callback config unloaders etc...
        if (mag.utils.callLCEvent('onunload', mag.mod.getState(ids), node, ids)) return;
        mag.clear(ids);
        // call unloaders
        callUnloaders(ids, node);
        // remove clones
        a.clones(ids).length = 0;
        if (remove) mag.fill.removeNode(node);
      };
      //chek if onbeforeunload exists
      if (mag.mod.getState(ids).onbeforeunload) {
        //call first
        //TODO: call children nodes with hooks too
        mag.utils.callLCEvent('onbeforeunload', mag.mod.getState(ids), node, ids, 0, function() {
          onremove();
        })
      } else {
        onremove();
      }
    }.bind({}, idInstance);
    a.getId = function(ids) {
      return ids
    }.bind({}, idInstance);
    a.draw = function(node, ids, force) {
      mag.redraw(node, ids, force)
    }.bind({}, node, idInstance)
    a.getState = function(ids, id) {
      return mag.mod.getState(id || ids)
    }.bind({}, idInstance)
    a.getProps = function(ids, id) {
      return mag.mod.getProps(id || ids)
    }.bind({}, idInstance);

    a.subscribe = handler.bind({}, idInstance);

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
        mag.redraw(getNode(id), index)
      } else if (mag.utils.items.isItem(id)) {
        mag.clear(index)
          //throw Error('invalid node id ' + id + ' index ' + index)
      }
    }.bind({}, idInstance, nodeId)
    mag.mod.setFrameId(idInstance, callback);
  }

  mag.clear = function(index) {
    cancelAnimationFrame(timers[index]);
    // remove from indexes
    mag.utils.items.removeItem(index)
      //mag.mod.remove(index)
    mag.mod.clear(index)
      //observer index ?
      // fill data cache
    mag.fill.clearCache(mag.mod.getId(index))
  }

  var makeRedrawFun = function(node1, idInstance1, force1) {
    return function(node, idInstance, force) {

      // clear node cache new run
      getNode(node.id, 1)

      // verify idInstance
      if (!isValidId(node.id, idInstance) || !node) {
        return
      }

      var state = mag.mod.getState(idInstance)

      // LIFE CYCLE EVENT
      if (mag.utils.callLCEvent('isupdate', state, node, idInstance)) return;

      // CACHED?
      if (mag.mod.iscached(idInstance) && !force) {
        return 0;
      };


      // LIFE CYCLE EVENT
      if (mag.utils.callLCEvent('willupdate', state, node, idInstance)) return;

      //RUN VIEW FUN
      mag.mod.callView(node, idInstance);

      var active = document.activeElement

      //START DOM
      mag.fill.setId(node.id)
      mag.fill.run(node, state);
      // END DOM

      if (document.activeElement !== active) active.focus()


      //CONFIGS
      callConfigs(node.id, mag.fill.configs)

      // LIFE CYCLE EVENT
      mag.utils.callLCEvent('didupdate', state, node, idInstance)

      //reset cache
      if (!force) mag.mod.iscached(idInstance);

    }.bind({}, node1, idInstance1, force1)
  }

  var callConfigs = function(id, configs) {
    for (var k in configs) {
      if (k.startsWith('id("' + id + '")/')) {
        configs[k]()
      }
    }
  }

  var addConfigUnloaders = function(id, index) {
    var arr = []

    for (var k in mag.fill.cached) {
      if (k.indexOf('id("' + id + '")/') > -1 && k.indexOf('-config') > -1 && mag.fill.cached[k].configContext) {

        arr.push({
          path: k.split('-config')[0],
          controller: mag.fill.cached[k].configContext,
          handler: mag.fill.cached[k].configContext.onunload
        })

      }
    }
    return arr;
  }

  var callUnloaders = function(index, node) {

    // add configs unloaders
    var arr = addConfigUnloaders(node.id, index);

    for (var i = 0, unloader, objects = arr; unloader = objects && objects[i]; i++) {

      if (unloader.controller.onunload) {
        unloader.handler.call(unloader.controller, node, unloader.path)
        unloader.controller.onunload = 0
      }
    }
  };


  var reloader = function(idInstance, node) {
    return mag.utils.callLCEvent('onreload', mag.mod.getState(idInstance), node, idInstance)
  }

  mag.getNode = getNode

})(window || global || this, document);
