;
(function(mag) {

  'use strict';

  var render = {
    roots: [],
    contexts: [],
    templates: {},
    unloaders: [],
    cache: {}
  }, iscached = function(key, data) {
      if (render.cache[key] && render.cache[key] === JSON.stringify(data)) {
        return true
      }
      render.cache[key] = JSON.stringify(data)
    }


    function callView(elementClone, module, i) {
      var args = module.getArgs(i),
        mod = module.modules[i],
        controller = module.controllers[i]

        // var controllerConstructor = mod.controller.$original || mod.controller
        // var controller = controllerConstructor === cached.controllerConstructor ? cached.controller : new(mod.controller || function() {})
        // give it unfrozen context ?

        // if (Object.keys(controller).length < 1) {
        // add one
        // initiates a draw
        //controller['__magnum__::'] = 1
        // }

      var context = render.contexts[i] = render.contexts[i] || {}
      //console.log(controller, args)
      //try {
      mod.view(args[0], elementClone, context)
      //} catch (e) {
      //THROW ?
      // console.log('Mag.JS', elementClone.id, i, e)
      //throw new Error(e)
      //}
      // if (controller.onunload) unloaders.push({
      //   controller: controller,
      //   handler: controller.onunload
      // })
    }

    // render.callOnload = function(module) {
    //   for (var i = 0, controller; controller = module.controllers[i]; i++) {
    //     // call once
    //     if (controller.onload && !controller.called) {
    //       controller.onload.call({}, module.elements[i])
    //       controller.called = 1
    //     }
    //   }
    // }


    // render.unloaders = []

    // call Lifecycle event
  render.callLCEvent = function(eventName, module, index, once) {
    var isPrevented = false,
      event = {
        preventDefault: function() {
          isPrevented = true
        }
      }
    if (module.controllers[index][eventName]) {
      module.controllers[index][eventName].call({}, event, module.elements[index])
      if (once) module.controllers[index][eventName] = 0
    }

    if (isPrevented) {
      // unloading
      //console.log(this.fill.cached)

      //console.log('unloader id', module.elements[index].id)

      //console.log('unloading', index, render.unloaders.length)

      for (var i = 0, unloader; unloader = render.unloaders[i]; i++) {
        //console.log('unloaderering')
        if (unloader.controller.onunload) {
          unloader.handler.call(unloader.controller, module.elements[index])
          unloader.controller.onunload = 0
        }
      }
    }

    return isPrevented
  }

  render.callConfigs = function(configs) {
    for (var i = 0, len = configs.length; i < len; i++) configs[i]()
  }

  render.redraw = function(module, fill, force) {

    module = module || render.module || {}
    if (force) render.cache = {}

    this.fun = (this.fun || throttle(function(id) {
      // clear existing configs
      fill.configs.splice(0, fill.configs.length)
      render.doLoop(module, fill)
    }))
    this.fun()
  }

  function addConfigUnloaders(module, fill, index) {

    //var cfgUnloaders = []

    for (var k in fill.cached) {
      //console.log(module.elements[index].id, k)
      if (k.indexOf('id("' + module.elements[index].id + '")/') !== -1 && k.indexOf('-config') !== -1 && fill.cached[k].configContext) {
        //            console.log(k, fill.cached[k].configContext.onunload)

        render.unloaders.push({
          controller: fill.cached[k].configContext,
          handler: fill.cached[k].configContext.onunload
        })

      }
    }

    //console.log(cfgUnloaders)

  }
  render.doLoop = function(module, fill) {
    for (var i = 0, root; root = render.roots[i]; i++) {
      // mag.running = true

      if (module.controllers[i] && module.elements[i]) {
        if (render.callLCEvent('willload', module, i, 1)) return

        if (!render.innerLoop(module, fill, i)) {
          //cached
          //debounce(
          // render.callLCEvent('didload', module, i, 1)
          //  , 1)
          //render.callConfigs(fill.configs)
        } else {
          module.deferreds[i][2]({
            _html: mag.prop(module.elements[i])
            // _html: function(node){ return node }.bind({}, module.elements[i])
            // _html : function(node){return fill.cloneNodeWithEvents(node)}.bind({}, module.elements[i]) 
            //clone: fill.cloneNodeWithEvents(module.elements[i])
            //_html: module.elements[i].innerHTML
          })
          render.callLCEvent('didload', module, i, 1)
          render.callConfigs(fill.configs)

          // add configs unloaders
          addConfigUnloaders(module, fill, i)
          //TODO: remove clones
          if (module.deferreds[i][0]) {
            var index = module.deferreds[i][1]
            delete module.elements[index],
              module.modules[index], module.controllers[index], module.promises[index], module.deferreds[index]
          }
        }
      }
    }
    //mag.running = false
    // fill.unclear()
  }

  render.clear = function(index, elementId, fill) {
    if (index !== -1 && render.cache[index]) {
      // clear events too
      // fill.clear()
      //console.log('clear called on reload', elementId)
      delete render.cache[index]
    }
  }
  render.innerLoop = function(module, fill, i) {
    var elementClone = module.elements[i]
    var args = module.getArgs(i)

    if (iscached(i, args)) {
      //console.log('completed run', i, elementClone.id, JSON.stringify(args[0]))
      return false
    }
    // circular references will throw an exception
    // such as setting to a dom element
    //cache[i] = JSON.stringify(args)

    callView(elementClone, module, i)



    // only setup once!
    // if (!module.elements[i].setWatch) {
    render.setupWatch(args, fill, elementClone, i, module)
    //    module.elements[i].setWatch = 1
    //}
    // remove 
    //delete args[0]['__magnum__::']
    fill.fill(elementClone, args[0])
    //render.callConfigs(fill.configs)

    // call onload if present in all controllers
    //render.callOnload(module)
    return true
  }
  var prevId
  //render.doWatch = function(fill, ele, i, module, frameId, prop, action, difference, oldvalue) {
  render.doWatch = function(fill, ele, i, module, changes, frameId) {

    if (frameId == prevId) return
    prevId = frameId
    //mag.running = true

    //console.log('componentWillUpdate', ele.id)
    // debounce(
    //TODO: return true then skip execution?
    render.callLCEvent('willupdate', module, i, 1)
    //, 1, 1)

    var args = module.getArgs(i)
    // check if data changed
    if (iscached(i, args)) {
      //console.log('componentDidUpdate', ele.id)
      // debounce(
      render.callLCEvent('didupdate', module, i)
      // , 1)
      return
    }

    // console.log('isupdate', ele.id, cache[i], i, JSON.stringify(args))
    render.callLCEvent('isupdate', module, i)
    //cache[i] = JSON.stringify(args)

    callView(ele, module, i)

    //delete args[0]['__magnum__::']
    fill.fill(ele, args[0])
    //render.callConfigs(fill.configs)

  }


  //mag.runner = false
  render.setupWatch = function(args, fill, elementClone, i, module) {
    // mag.watch.watch(args[0], throttle(render.doWatch.bind(null, fill, elementClone, i, module)), 6, true)
    // return
    //this.fun = (this.fun || throttle(render.doWatch.bind(null, fill, elementClone, i, module)))
    //mag.runner = false;
    // var changed = false;
    // console.log('setup watch', elementClone.id)
    var observer = function(changes) {
      //console.log('observer',mag.runner)
      changes.forEach(function(change) {
        //if (change.type == 'add' || change.type == 'update') {
        //console.log(change.name, change.type)
        if (change.type == 'update' && change.oldValue.type == 'fun' && change.oldValue.data && change.oldValue.data.type == 'module' && !change.object[change.name].data) {
          // call unloader for module
          render.callLCEvent('onunload', module, change.oldValue.data.id, 1)
          //console.log(change.name,change.object[change.name].data, change.oldValue.data)
        }
        //if(change.object[change.name].type=='fun' && change.object[change.name]()._html.data){
        //console.log(change.name, change.type, change.object[change.name]()._html.typeName, change.object)
        //}
        //changed = true
        // return
        // }
      });
      //      if (!mag.runner) {
      //mag.runner = true
      // retain reference
      module.controllers[i] = args[0]
      throttle(render.doWatch.bind({}, fill, elementClone, i, module, changes))()
      //    }
    }
    // Which we then observe
    observeNested(args[0], observer);
  }
  var $cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
  var $requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

  var throttle = function(fn, threshhold) {
    var lastRedrawCallTime, FRAME_BUDGET = threshhold || 16,
      deferTimer
    return function() {
      if (+new Date - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window.requestAnimationFrame) {
        // hold on to it
        if (deferTimer > 0) $cancelAnimationFrame(deferTimer)
        var args = arguments
        deferTimer = $requestAnimationFrame(function() {
          lastRedrawCallTime = +new Date
          var nargs = [].slice.call(arguments).concat([].slice.call(args))
          fn.apply(this, nargs);
        }, FRAME_BUDGET)
      } else {
        lastRedrawCallTime = +new Date
        var nargs = [].slice.call(arguments).concat([].slice.call(args))
        fn.apply(this, nargs)
        deferTimer = $requestAnimationFrame(function() {
          deferTimer = null
        }, FRAME_BUDGET)
      }
    }
  }

  mag.render = render

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {

      var obj = this,
        args = arguments;

      function delayed() {
        if (!immediate)
          func.apply(obj, args);
        timeout = null;
      };

      if (timeout)
        $cancelAnimationFrame(timeout);
      else if (immediate)
        func.apply(obj, args);

      timeout = $requestAnimationFrame(delayed, wait);
    };
  };

  function notifySubobjectChanges(object) {
    var notifier = Object.getNotifier(object); // get notifier for this object
    for (var k in object) { // loop over its properties
      var prop = object[k]; // get property value
      if (!prop || typeof prop !== 'object') break; // skip over non-objects
      Object.observe(prop, function(changes) { // observe the property value
        changes.forEach(function(change) { // and for each change
          notifier.notify(change);
        });
      });
      notifySubobjectChanges(prop); // repeat for sub-subproperties
    }
  }


  function observeNested(obj, callback) {
    if (obj && typeof Object.observe !== 'undefined') {
      notifySubobjectChanges(obj); // set up recursive observers
      Object.observe(obj, debounce(callback, 16));
    }
  }

})(window.mag || {})
