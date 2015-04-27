;
(function(mag) {

  "use strict";

  var render = {
    roots: [],
    contexts: [],
    templates: {},
    cache: {}
  }

  var unloaders = [],
    cached = [],
    pendingRequests = 0

    function callView(elementClone, module, i) {
      var args = module.getArgs(i)
      var mod = module.modules[i]
      var controller = module.controllers[i]

      // var controllerConstructor = mod.controller.$original || mod.controller
      // var controller = controllerConstructor === cached.controllerConstructor ? cached.controller : new(mod.controller || function() {})
      // give it unfrozen context ?


      var context = render.contexts[i] = render.contexts[i] || {}

      try {
        mod.view(controller, elementClone, context)
      } catch (e) {
        //THROW ?
        console.log(elementClone.id, i, e)
        //throw new Error(e)
      }
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


  render.unloaders = []

  // call Lifecycle event
  render.callLCEvent = function(eventName, module, index, once) {
    var isPrevented = false
    var event = {
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
  var cache = []
  render.redraw = function(module, fill) {

    module = module || render.module || {}

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
        if (k.indexOf('id("' + module.elements[index].id + '")/') !== -1) {
          if (fill.cached[k].configContext) {
            //            console.log(k, fill.cached[k].configContext.onunload)

            render.unloaders.push({
              controller: fill.cached[k].configContext,
              handler: fill.cached[k].configContext.onunload
            })
          }
        }
      }

      //console.log(cfgUnloaders)

    }
  render.doLoop = function(module, fill) {
    for (var i = 0, root; root = render.roots[i]; i++) {
      mag.running = true

      if (module.controllers[i] && module.elements[i]) {
        //debounce(
        if (render.callLCEvent('willload', module, i, 1)) return

        //, 1, 1)
        if (!render.innerLoop(module, fill, i)) {
          //cached
          //debounce(
          // render.callLCEvent('didload', module, i, 1)
          //  , 1)
          //render.callConfigs(fill.configs)
        } else {
          module.deferreds[i][2]({
            _html: module.elements[i].innerHTML
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
    fill.unclear()
  }

  render.clear = function(index, elementId, fill) {
    if (index !== -1 && cache[index]) {
      // clear events too
      fill.clear()
      //console.log('clear called on reload', elementId)
      // delete cache[index]
    }
  }
  render.innerLoop = function(module, fill, i) {
    var elementClone = module.elements[i]
    var args = module.getArgs(i)

    if (cache[i] && cache[i] === JSON.stringify(args[0])) {
      //console.log('completed run',i, elementClone.id)
      return false
    }
    callView(elementClone, module, i)

    // circular references will throw an exception
    // such as setting to a dom element
    cache[i] = JSON.stringify(args[0])

    render.setupWatch(args, fill, elementClone, i, module)

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
    mag.running = true

    //console.log('componentWillUpdate', ele.id)
    // debounce(
    render.callLCEvent('willupdate', module, i, 1)
    //, 1, 1)

    var args = module.getArgs(i)

    // check if data changed
    if (cache[i] && cache[i] === JSON.stringify(args[0])) {
      //console.log('componentDidUpdate', ele.id)
      // debounce(
      render.callLCEvent('didupdate', module, i)
      // , 1)
      return
    }
    callView(ele, module, i)
    cache[i] = JSON.stringify(args[0])

    fill.fill(ele, args[0])
    //render.callConfigs(fill.configs)

    mag.running = false
  }

  render.setupWatch = function(args, fill, elementClone, i, module) {
    // WatchJS.watch(args[0], throttle(render.doWatch.bind(null, fill, elementClone, i, module)), 6, true)
    // return
    //this.fun = (this.fun || throttle(render.doWatch.bind(null, fill, elementClone, i, module)))

    // Which we then observe
    observeNested(args[0], function(changes) {
      // changes.forEach(function(change) {
      //console.log(change.type, change.name, change.oldValue);
      //});
      throttle(render.doWatch.bind({}, fill, elementClone, i, module, changes))()
    });
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

  // function debounce(func, wait, immediate) {
  //   var timeout;
  //   return function() {
  //     var context = this,
  //       args = arguments;
  //     var later = function() {
  //       timeout = null;
  //       if (!immediate) func.apply(context, args);
  //     };
  //     var callNow = immediate && !timeout;
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //     if (callNow) func.apply(context, args);
  //   };
  // };

  function observeNested(obj, callback) {
    if (obj && typeof Object.observe !== 'undefined') {
      Object.observe(obj, function(changes) {
        changes.forEach(function(change) {
          if (typeof obj[change.name] == 'object') {
            observeNested(obj[change.name], callback);
          }
        });
        callback.apply(this, arguments);
      });
    }
  }


})(window.mag || {})
