/*
MagJS v0.21
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, document, undefined) {

  'use strict';

  //Plugins:
  var hookins = {
    values: [],
    attributes: [],
    elementMatcher: []
  }

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
      idInstance = mag.utils.getItemInstanceId(props.key ? id + '.' + props.key : id)
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

    // unloader handlers in controller
    addControllerUnloaders(idInstance)


    // DRAW async
    mag.redraw(node, idInstance, 1);

    // LIFE CYCLE EVENT
    mag.utils.callLCEvent('didload', mag.mod.getState(idInstance), node, idInstance, 1);

    // return function to clone create new clone instances ;)
    return makeClone(idInstance, node, mod, mag.utils.copyFun(props))
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
  mag.redraw = function(node, idInstance, force) {
    if (!pendingRequests[idInstance]) {

      if (!node || typeof idInstance == 'undefined') {
        throw Error('Mag.JS - Id or node invalid: ' + idInstance);
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
      fastdom.clear(mag.mod.getFrameId(idInstance))
        //ENQUEUE
      var fid = fastdom.write(fun);
      //save frame id with the instance 
      mag.mod.setFrameId(idInstance, fid)
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
      mag.utils.callHook(hookins, key, name, i, data)
    }
  }

  var makeClone = function(idInstance, node, mod, props) {
    // recursion warning
    var a = function(id, node, mod, props, index) {

      var cloner = node.cloneNode(1)
      cloner.id = node.id + (props.key ? '.' + props.key : '') + '.' + index;

      // prevent recursion

      // if clone already exists return ?
      if (mag.utils.items.isItem(cloner.id)) {
        //return cloner
      }

      var idInstance2 = mag.utils.getItemInstanceId(cloner.id)

      // get unique instance ID's module
      mag.mod.submodule(cloner.id, idInstance2, mod, props)

      observer(idInstance2, cloner.id)


      // DRAW
      mag.redraw(cloner, idInstance2, 1)

      return cloner
    }.bind({}, idInstance, node, mod, props)

    //BOUND CLONE INSTANCE METHODS
    a.getId = function(ids) {
      return ids
    }.bind({}, idInstance)
    a.draw = function(node, ids, force) {
      mag.redraw(node, ids, force)
    }.bind({}, node, idInstance)
    a.getState = function(ids) {
      return mag.mod.getState(ids)
    }.bind({}, idInstance)
    a.getProps = function(ids) {
      return mag.mod.getProps(ids)
    }.bind({}, idInstance)

    return a
  }
  var nodeCache = []

  function getNode(id, clear) {
    //cache nodes?
    if (nodeCache[id] && !clear) return nodeCache[id]
    var node = document.getElementById(id);
    if (node) nodeCache[id] = node
    if (!node) {}
    return node;
  }

  var observer = function(idInstance, nodeId) {
    var callback = function(index, id, change) {
      if (getNode(id)) {
        mag.redraw(getNode(id), index)
      } else if (mag.utils.items.isItem(id)) {
        mag.clear(index)
          //throw Error('invalid node id ' + id + ' index ' + index)
      }
    }.bind({}, idInstance, nodeId)
    mag.props.setup(idInstance,  callback)
  }

  mag.clear = function(index) {
    fastdom.clear(mag.mod.getFrameId(index))
      // remove from indexes
    mag.utils.items.removeItem(index)
      //mag.mod.remove(index)
    mag.mod.clear(index)
      //observer index
    mag.props.cached.splice(index, 1)
      // fill data cache
    mag.fill.clearCache(mag.mod.getId(index))
  }

  var makeRedrawFun = function(node1, idInstance1, force1) {
    return function(node, idInstance, force) {

      getNode(node.id, 1)

      // verify idInstance
      if (!isValidId(node.id, idInstance) || !node) {
        return
      }

      var state = mag.mod.getState(idInstance)

      // LIFE CYCLE EVENT
      if (mag.utils.callLCEvent('isupdate', state, node, idInstance)) return;

      var props = mag.mod.getProps(idInstance)

      var data = mag.utils.merge(mag.utils.copy(props), mag.utils.copy(state))

      // CACHED?
      if (mag.mod.iscached(idInstance, data) && !force) {
        return 0;
      };


      // LIFE CYCLE EVENT
      if (mag.utils.callLCEvent('willupdate', state, node, idInstance)) return;


      //RUN VIEW FUN
      mag.mod.callView(node, idInstance);

      //START DOM
      mag.fill.setId(node.id)
      mag.fill.run(node, state)
      // END DOM

      //CONFIGS
      callConfigs(node.id, mag.fill.configs)

      // add configs unloaders
      addConfigUnloaders(node.id, idInstance)

      // LIFE CYCLE EVENT
      mag.utils.callLCEvent('didupdate', state, node, idInstance)

      // get parent to call
      if(node && node.parentNode){
        var parent = findClosestId(node.parentNode)
        if(parent) {
          mag.redraw(parent, mag.utils.items.getItem(parent.id))
        }
      }
      
    }.bind({}, node1, idInstance1, force1)
  }


  var findClosestId=  function (node) {
    if (node.id) return node
    if (node.parentNode) return findClosestId(node.parentNode)
  }

  var callConfigs = function(id, configs) {
    for (var k in configs) {
      if (k.indexOf('id("' + id + '")/') > -1) {
        configs[k]()
      }
    }
  }

  var addControllerUnloaders = function(idInstance) {
    // TODO: controller unloaders
    var state = mag.mod.getState(idInstance)
    mag.utils.unloaders[idInstance] = mag.utils.unloaders[idInstance] || []
    if (state.onunload) mag.utils.unloaders[idInstance].push({
      controller: state,
      handler: state.onunload
    })
  }

  var addConfigUnloaders = function(id, index) {

    for (var k in mag.fill.cached) {
      if (k.indexOf('id("' + id + '")/') > -1 && k.indexOf('-config') > -1 && mag.fill.cached[k].configContext) {

        mag.utils.unloaders[index] = mag.utils.unloaders[index] || []

        mag.utils.unloaders[index].push({
          controller: mag.fill.cached[k].configContext,
          handler: mag.fill.cached[k].configContext.onunload
        })

      }
    }
  }


  var reloader = function(idInstance, node) {
    return mag.utils.callLCEvent('onreload', mag.mod.getState(idInstance), node, idInstance)
  }

  mag.getNode = getNode
  window.mag = mag


})(window.mag || {}, document);
