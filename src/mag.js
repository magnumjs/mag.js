;
(function(mag, document, undefined) {

  'use strict'

  var module = mag.mod,
    render = mag.render,
    fill = mag.fill,
    topModule,
    watch = mag.watch,
    type = {}.toString,
    FUNCTION = "function",
    OBJECT = "[object Object]";
  mag.running = false

  var redrawing = false
  mag.redraw = function() {
    if (redrawing) {
      // do we ever get here?
      // necessary?
      return
    }
    redrawing = true
    render.redraw(module || render.module || {}, fill, watch)
    redrawing = false
  }

  mag.withProp = function(prop, withAttrCallback) {
    return function(e) {
      e = e || event;
      var currentTarget = e.currentTarget || this;
      withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
    }
  }

  mag.prop = function(store) {

    if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
      return propify(store)
    }

    return gettersetter(store)
  }

  function gettersetter(store) {
    var prop = function() {
      if (arguments.length) {
        store = arguments[0]
        mag.redraw()
      }
      return store
    }

    prop.type = 'fun'

    prop.toJSON = function() {
      // return a copy
      return store
    }

    return prop
  }

  function propify(promise, initialValue) {
    var prop = mag.prop(initialValue);
    promise.then(prop);
    prop.then = function(resolve, reject) {
      return propify(promise.then(resolve, reject), initialValue)
    };
    return prop
  }

  var hookins = {
    attributes: []
  }
  mag.hookin = function(name, key, handler) {
    hookins[name].push({
      context: {},
      handler: handler,
      key: key
    })
  }

  mag.hook = function(name, key, data, before) {
    for (var i in hookins[name]) {
      data.changed = false
      if (hookins[name][i].key == key) {
        before = JSON.stringify({
          v: data.value,
          k: data.key
        })
        hookins[name][i].handler.call(hookins[name][i].context, data)
        //if any change
        if (before !== JSON.stringify({
          v: data.value,
          k: data.key
        })) {
          data.change = true
        }
      }
    }
  }

  var unloaders = []
  mag.module = function(domElementId, moduleObject, props, clone) {

    var index = render.roots.indexOf(domElementId)

    // clear cache if exists
    if (props && !props.retain) render.clear(index, domElementId, fill)
    // create new index on roots
    if (index < 0 || clone) index = render.roots.length;


    //unloaders that exists?

    var isPrevented = false;
    var event = {
      preventDefault: function() {
        isPrevented = true
      }
    };
    for (var i = 0, unloader; unloader = unloaders[i]; i++) {
      unloader.handler(event)
      unloader.controller.onunload = null
    }
    if (isPrevented) {
      for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
    } else unloaders = []

    if (isPrevented) return


    //DOM
    var element = document.getElementById(domElementId)
    if (!element) return Error('invalid node')


    render.roots[index] = element.id

    //MODULE
    if (!moduleObject.view) return Error('module requires a view')

    var mod = module.submodule(moduleObject, [props || {}])

    var controller = module.getController(mod, element, fill)

    module.controllers[index] = controller
    if (controller.onunload) unloaders.push({
      controller: controller,
      handler: controller.onunload
    })

    module.modules[index] = mod
    module.elements[index] = clone ? element.cloneNode(true) : element


    module.promises[index] = new Promise(function(resolve, reject) {
      module.deferreds[index] = arguments
    }.bind(null, clone, index))

    //INTERPOLATIONS
    mag.redraw()


    // call controller unloaders ?
    // check if was in previous and now not for the same node
    // add to fill.js

    // call onload if present in controller
    if (controller.onload && !mag.running) render.callOnload(module)
    // interpolations haven't occurred yet
    // return a promise in a settergetter

    return propify(module.promises[index], {
      _html: module.elements[index].innerHTML
    })

  }

})(window.mag || {}, document)
