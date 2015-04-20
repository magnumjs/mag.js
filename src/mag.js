;
(function(mag, document, undefined) {

  'use strict'

  var module = mag.mod,
    render = mag.render,
    fill = mag.fill,
    topModule,
    watch = mag.watch;

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

  mag.hookins = {
    attributes: []
  }
  mag.hookin = function(name, key, handler) {
    mag.hookins[name].push({
      context: {},
      handler: handler,
      key: key
    })
  }

  mag.hook = function(name, key, data, before) {
    for (var i in mag.hookins[name]) {
      data.changed = false
      if (mag.hookins[name][i].key == key) {
        before = JSON.stringify({
          v: data.value,
          k: data.key
        })
        mag.hookins[name][i].handler.call(mag.hookins[name][i].context, data)
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
  mag.module = function(domElementId, moduleObject, props) {

    var index = render.roots.indexOf(domElementId)

    // clear cache if exists
    if (props && !props.retain) render.clear(index, domElementId, fill)
    // create new index on roots
    if (index < 0) index = render.roots.length;


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
    module.elements[index] = element


    //INTERPOLATIONS
    mag.redraw()


    // call controller unloaders ?
    // check if was in previous and now not for the same node
    // add to fill.js

    // call onload if present in controller
    if (controller.onload && !mag.running) render.callOnload(module)
    return {
      _html: element.innerHTML
    }
    // return instance ?
    // module.controllers[index]
  }

})(window.mag || {}, document)
