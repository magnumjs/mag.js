/*
MagJS v0.17
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, document, undefined) {

  'use strict';

  var hookins = {
      attributes: [],
      elementMatcher: []
    },
    funqueue = []


  mag.build = function(id, module, props) {
    var instance,
      a = function(id2, props2) {
        if (typeof id2 !== 'string') {
          props2 = [].concat(id2)[0]
          id2 = 0
        }
        instance = mag.module(id2 || id, module, mag.utils.copy(mag.utils.merge(props2 || {}, props || {})))
        return instance;
      }
    a.toJSON = function() {}
    a.getState = function() {}
    a.toHTML = function() {}
    return a;
  }

  mag.module = function(id, mod, props) {

    props = props || {}


    // already here before?
    if (mag.utils.items.isItem(id)) {
      if (reloader(mag.utils.items.getItem(id), getNode(id))) return;
    }


    // get unique instance ID if not exists or with props.key
    var idInstance = props.key && mag.utils.items.isItem(id + '.'.props.key) || mag.utils.getItemInstanceId(id)


    // TODO: cache/ clearable
    // clear cache if exists
    // if (!props.retain) cache.clear(idInstance)

    // get unqiue instance ID's module
    mag.mod.submodule(idInstance, mod, props)

    // NODE
    var node = getNode(id)

    //WATCH
    observer(idInstance, id)

    // LIFE CYCLE EVENT
    if (mag.utils.callLCEvent('willload', mag.mod.getState(idInstance), node, idInstance, 1)) return;

    // unloader handlers in controller
    addControllerUnloaders(idInstance)


    // DRAW async
    mag.redraw(node, idInstance, 1)

    // LIFE CYCLE EVENT
    mag.utils.callLCEvent('didload', mag.mod.getState(idInstance), node, idInstance, 1)


    // return function to clone create new clone instances ;)
    return makeClone(idInstance, node, mod, props)
  }

  mag.redraw = function(node, idInstance, force) {

    // clear existing configs ?
    // TODO: per idInstance / id ?
    mag.fill.configs.splice(0, mag.fill.configs.length)

    var fun = makeRedrawFun(node, idInstance, force)
    funqueue.push(fun)

    if (!mag.utils.throttle.redrawing) {
      mag.utils.throttle(function() {
        if (!mag.utils.throttle.redrawing) {
          console.log('RUN', count++)
          while (funqueue.length > 0) {
            (funqueue.shift())();
          }
        }
      })
    }
  }
  var count = 0

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
    return function(id, node, mod, props, index) {

      var cloner = node.cloneNode(1)
      cloner.id = node.id + '.' + index;

      var idInstance2 = mag.utils.getItemInstanceId(cloner.id)

      // get unqiue instance ID's module
      mag.mod.submodule(idInstance2, mod, props)

      observer(idInstance2, cloner.id)

      // DRAW
      mag.redraw(cloner, idInstance2, 1)
      return cloner
    }.bind({}, idInstance, node, mod, props)
  }

  function getNode(id) {
    var node = document.getElementById(id);
    if (!node) {
      throw Error('invalid node id: ' + id);
    }
    return node;
  }

  var observer = function(idInstance, nodeId) {
    mag.prop.setup(mag.mod.getState(idInstance), function(index, id, change) {
      mag.redraw(getNode(id), index)
    }.bind({}, idInstance, nodeId))
  }


  var makeRedrawFun = function(node, idInstance, force) {
    return function(node, idInstance, force) {

      var state = mag.mod.getState(idInstance)

      // LIFE CYCLE EVENT
      if (mag.utils.callLCEvent('isupdate', state, node, idInstance)) return;

      // CACHED?
      if (mag.mod.iscached(idInstance, state) && !force) {
        return 0;
      };

      // LIFE CYCLE EVENT
      if (mag.utils.callLCEvent('willupdate', state, node, idInstance)) return;

      //RUN VIEW FUN
      mag.mod.callView(node, idInstance);

      //START DOM
      var display = node.style.display || ''
      node.style.display = 'none'
      var node = mag.fill.run(node, state)
      node.style.display = display
        // END DOM


      //CONFIGS
      callConfigs(node.id, mag.fill.configs)

      // add configs unloaders
      addConfigUnloaders(node.id, idInstance)

      // LIFE CYCLE EVENT
      mag.utils.callLCEvent('didupdate', state, node)

    }.bind({}, node, idInstance, force)
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
      //console.log(module.elements[index].id, k)
      if (k.indexOf('id("' + id + '")/') > -1 && k.indexOf('-config') > -1 && mag.fill.cached[k].configContext) {
        // console.log(k, mag.fill.cached[k].configContext.onunload)

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

  window.mag = mag


})(window.mag || {}, document);
