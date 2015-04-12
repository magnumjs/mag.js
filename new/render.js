;
(function(mag) {

  "use strict";

  var render = {
    roots: [],
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

      mod.view(elementClone, controller)

      // if (controller.onunload) unloaders.push({
      //   controller: controller,
      //   handler: controller.onunload
      // })
    }

  render.callOnload = function(module) {
    for (var i = 0, controller; controller = module.controllers[i]; i++) {
      // call once
      if (controller.onload && !controller.called) {
        controller.onload.call(null, module.elements[i])
        controller.called = 1
      }
    }
  }
  render.callConfigs = function(configs) {
    for (var i = 0, len = configs.length; i < len; i++) configs[i]()
  }
  var cache = []
  render.redraw = function(module, fill, WatchJS) {
    module = module || render.module || {}
    this.fun || (this.fun = debounce(function() {
      // clear existing configs
      fill.configs.splice(0, fill.configs.length)

      render.doLoop(module, fill, WatchJS)
    }))
    this.fun()
  }

  render.doLoop = function(module, fill, WatchJS) {
    for (var i = 0, root; root = render.roots[i]; i++) {
      mag.running = true

      if (module.controllers[i]) {
        if (!render.innerLoop(module, fill, i, WatchJS)) {
          continue
        }
      }
    }
  }

  render.innerLoop = function(module, fill, i, WatchJS) {
    var elementClone = module.elements[i]
    var args = module.getArgs(i)

    if (cache[i] && cache[i] === JSON.stringify(args[0])) {
      return false
    }
    callView(elementClone, module, i)
    cache[i] = JSON.stringify(args[0])

    render.setupWatch(WatchJS, args, fill, elementClone, i, module)

    fill.fill(elementClone, args[0])
    render.callConfigs(fill.configs)

    // call onload if present in all controllers
    render.callOnload(module)
  }

  render.doWatch = function(fill, ele, i, module, changeId) {
    mag.running = true
    var args = module.getArgs(i)

    // check if data changed
    if (cache[i] && cache[i] === JSON.stringify(args[0])) {
      return
    }
    callView(ele, module, i)
    cache[i] = JSON.stringify(args[0])

    fill.fill(ele, args[0])

    render.callConfigs(fill.configs)

    mag.running = false
  }

  render.setupWatch = function(WatchJS, args, fill, elementClone, i, module) {
    WatchJS.watch(args[0], debounce(render.doWatch.bind(null, fill, elementClone, i, module)))
  }
  var $cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
  var $requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

  var debounce = function(fn, threshhold) {
    var lastRedrawCallTime, FRAME_BUDGET = threshhold || 16,
      deferTimer
    return function() {
      if (+new Date - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window.requestAnimationFrame) {
        // hold on to it
        if (deferTimer > 0) $cancelAnimationFrame(deferTimer)

        deferTimer = $requestAnimationFrame(function() {
          lastRedrawCallTime = +new Date
          fn.apply(this, arguments);
        }, FRAME_BUDGET)
      } else {
        lastRedrawCallTime = +new Date
        fn.apply(this, arguments)
        deferTimer = $requestAnimationFrame(function() {
          deferTimer = null
        }, FRAME_BUDGET)
      }
    }
  }

  mag.render = render

})(window.mag || {})
