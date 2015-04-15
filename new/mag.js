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


    var controller

    // FireFox support only
    if (typeof Proxy !== 'undefined') {
      controller = new Proxy(new mod.controller, {
        get: function(target, prop) {
          if (target[prop] === undefined && ['watchers', 'toJSON', 'called', 'onload', 'onunload'].indexOf(prop) === -1) {
            var a = fill.find(element, prop),
              v
            if (a[0]) {
              if (a[0].value && a[0].value.length > 0)
                v = a[0].value
              if (a[0].innerText && a[0].innerText.length > 0)
                v = a[0].innerText
              if (a[0].innerHTML && a[0].innerHTML.length > 0)
                v = a[0].innerHTML
            }
            return v
          }
          return target[prop]
        }
      })

    } else {
      controller = new mod.controller
    }


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
