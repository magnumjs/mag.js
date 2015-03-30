var mag = (function(self, document, undefined) {

  'use strict'

  var privates = {},
    module = self.mod,
    render = self.render,
    fill = self.fill,
    topModule,
    watch = self.watch;

  // set logger
  self.logger = fill.logger || self.logger

  // REMOVE THIS? why is this here?
  privates.init = function(container, data) {
    // if (!(this instanceof privates.init)) return new privates.init(container, data)
    // var instance = this
  }
  var redrawing = false
  privates.redraw = function() {
    if (redrawing) {
      // do we ever get here?
      // necessary?
      return
    }
    redrawing = true
    render.redraw(module || render.module || {}, fill, watch)
    redrawing = false
  }

  privates.withProp = function(prop, withAttrCallback) {
    return function(e) {
      e = e || event;
      var currentTarget = e.currentTarget || this;
      withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
    }
  }

  privates.prop = function(store) {
    var prop = function() {
      if (arguments.length) {
        store = arguments[0]
        privates.redraw()
      }
      return store
    }

    prop.type = 'fun'

    prop.toJSON = function() {
      // return a copy
      return JSON.parse(JSON.stringify(store))
    }

    return prop
  }


  privates.module = function(domElementId, moduleObject, props, reuse) {
    fill.log('time')("MagnumJS:init:" + domElementId)

    var index = render.roots.indexOf(domElementId)
    // create new index on roots
    if (index < 0) index = render.roots.length;

    //DOM

    var element = document.getElementById(domElementId)
    if (!element) return Error('invalid node')

    var parentElement = element.parentNode
    var elementClone = element.cloneNode(true)

    var tempEle = document.createElement("span")
    parentElement.replaceChild(tempEle, element)

    render.roots[index] = elementClone.id


    //MODULE
    if (!moduleObject.view) return Error('module requires a view')

    var mod = module.submodule(moduleObject, [props])


    var currentModule = topModule = mod = mod || {}
    var controller = new mod.controller


    //this conditional ensures only the last recursive module call is applied
    // REALLY necessary?
    if (currentModule === topModule) {

      module.controllers[index] = controller;
      module.modules[index] = mod
      module.elements[index] = elementClone

    }

    //INTERPOLATIONS
    privates.redraw()

    //DOM
    parentElement.replaceChild(elementClone, tempEle)

    // call controller unloaders ?
    // check if was in previous and now not for the same node
    // add to fill.js


    // call onload if present in controller
    if (controller.onload) controller.onload.call(null, elementClone)

    fill.log('timeEnd')("MagnumJS:init:" + domElementId)

    // return instance ?
    // module.controllers[index]
    return {
      _html: elementClone.innerHTML
    }
  }

  // set to 0/off to disable
  privates.logger = function(logger) {
    self.logger = logger
  }

  var interfaces = function(method) {
    return function() {
      return privates[method].apply(this, arguments)
    }
  }

  var api = interfaces('init')

  api['module'] = interfaces('module')
  api['prop'] = interfaces('prop')
  api['redraw'] = interfaces('redraw')
  api['withProp'] = interfaces('withProp')
  api['logger'] = interfaces('logger')

  return api

}(window.mag || {}, document))
