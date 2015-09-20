;
(function(mag) {

  'use strict';

  var render = {
      roots: [],
      contexts: [],
      templates: {},
      unloaders: [],
      cache: {}
    },
    iscached = function(key, data) {
      if (render.cache[key] && render.cache[key] === JSON.stringify(data)) {
        return true
      }
      render.cache[key] = JSON.stringify(data)
    }


  function callView(elementClone, module, i) {
    var args = module.getArgs(i),
      mod = module.modules[i],
      controller = module.controllers[i];

    //module.modules[i].id = elementClone.id;
    // mag.count = []

    if (mod) mod.view(args[0], elementClone)
  }


  // call Lifecycle event
  render.callLCEvent = function(eventName, module, index, once) {
    var isPrevented = false,
      event = {
        preventDefault: function() {
          isPrevented = true
        }
      }
    if (module.controllers[index] && module.controllers[index][eventName]) {
      module.controllers[index][eventName].call({}, event, module.elements[index])
      if (once) module.controllers[index][eventName] = 0
    }

    if (isPrevented) {
      // unloading

      for (var i = 0, unloader; unloader = render.unloaders[i]; i++) {

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
  }
  render.doLoop = function(module, fill) {
    for (var i = 0, root; root = render.roots[i]; i++) {

      if (module.controllers[i] && module.elements[i]) {
        if (render.callLCEvent('willload', module, i, 1)) return

        if (!render.innerLoop(module, fill, i)) {

        } else {
          module.deferreds[i][1]({
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
            // if (module.deferreds[i][0]) {
            //   delete module.elements[i]
            //   delete module.modules[i]
            //   delete module.controllers[i]
            //   delete module.promises[i]
            //   delete module.deferreds[i]
            // }
        }
      }
    }

  }

  render.clear = function(index, elementId, fill) {
    if (index !== -1 && render.cache[index]) {
      //console.log('clear called on reload', elementId)
      delete render.cache[index]
    }
  }
  render.innerLoop = function(module, fill, i) {
    var elementClone = module.elements[i]
    var args = module.getArgs(i)

    if (iscached(i, args)) {
      return false
    }
    // circular references will throw an exception
    // such as setting to a dom element
    callView(elementClone, module, i)

    render.setupWatch(args, fill, elementClone, i, module)

    fill.fill(elementClone, args[0])

    return true
  }

  var $cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
  var $requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

  var throttle = function(fn, threshhold) {
    var lastRedrawCallTime, FRAME_BUDGET = threshhold || 16,
      deferTimer
    return function() {
      var args = arguments
      if ($requestAnimationFrame === window.requestAnimationFrame || +new Date - lastRedrawCallTime > FRAME_BUDGET) {
        // hold on to it
        if (deferTimer > 0) $cancelAnimationFrame(deferTimer)
        deferTimer = $requestAnimationFrame(function() {
          lastRedrawCallTime = +new Date
          var nargs = [].slice.call(arguments).concat([].slice.call(args))
          fn.apply(this, nargs);
          mag.redrawing = false
        }, FRAME_BUDGET)
      } else {
        // called when setTimeout is used
        lastRedrawCallTime = +new Date
        var nargs = [].slice.call(arguments).concat([].slice.call(args))
        fn.apply(this, nargs)
        deferTimer = $requestAnimationFrame(function() {
          deferTimer = null
          mag.redrawing = false
        }, FRAME_BUDGET)
      }
    }
  }

  mag.render = render

  var prevId

  render.doWatch = function(fill, ele, i, module, changes, frameId) {

    if (frameId == prevId) return
    prevId = frameId

    render.callLCEvent('isupdate', module, i)


    var args = module.getArgs(i)
      // check if data changed
    if (iscached(i, args)) {
      return
    }
    //TODO: return true then skip execution?
    if (render.callLCEvent('willupdate', module, i, 1)) return

    callView(ele, module, i)

    fill.fill(ele, args[0])
    render.callLCEvent('didupdate', module, i)
  }

  render.setupWatch = function(args, fill, elementClone, i, module) {

    // console.log('setup', i)

    var observer = function(changes) {
        changes.forEach(function(change) {

          if (change.type == 'update' && change.oldValue && change.oldValue.type == 'fun' && change.oldValue.data && change.oldValue.data.type == 'module' && change.object[change.name] && !change.object[change.name].data) {
            // call unloader for module
            render.callLCEvent('onunload', module, change.oldValue.data.id, 1)
              //console.log(change.name,change.object[change.name].data, change.oldValue.data)
          }
          //console.log('change', change.type, change.name)

        });

        module.controllers[i] = args[0]
        throttle(render.doWatch.bind({}, fill, elementClone, i, module, changes))()
      }
      // Which we then observe
    observeNested(args[0], observer);
  }

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
  var exclude = ['add', 'update', 'delete']

  function notifySubobjectChanges(object) {
    var notifier = Object.getNotifier(object); // get notifier for this object
    var handle = function(changes) { // observe the property value
      changes.forEach(function(change) { // and for each change
        notifier.notify(change);
      });
    }
    for (var k in object) { // loop over its properties
      var prop = object[k]; // get property value
      if (!prop || typeof prop !== 'object') break; // skip over non-objects
      if (typeof Array.observe !== 'undefined' && Array.isArray(prop)) {
        Array.observe(prop, handle, exclude);
      } else {
        Object.observe(prop, handle, exclude);
      }
      notifySubobjectChanges(prop); // repeat for sub-subproperties
    }
  }


  function observeNested(obj, callback) {
    if (obj && typeof Object.observe !== 'undefined') {
      var handler = debounce(callback, 16)
        // var handler = callback
      notifySubobjectChanges(obj); // set up recursive observers
      Object.observe(obj, handler, exclude);
      //Object.unobserve(obj, handler);
    }
  }

})(window.mag || {})
