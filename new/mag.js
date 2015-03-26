var mag = (function(self, module, render, document, undefined) {

  'use strict'

  var privates = {}

  privates.init = function(container, data) {
    if (!(this instanceof privates.init)) return new privates.init(container, data);
    var instance = this;
    console.log('mag init')
  }

  privates.redraw=function(){
    render.redraw( module || render.module || {})
  }

  privates.prop = function(store) {
    var prop = function() {
      if (arguments.length) {
        store = arguments[0]
        render.redraw(module)
      }
      return store
    }

    prop.toJSON = function() {
      // return a copy
      return JSON.parse(JSON.stringify(store))
    }

    return prop
  }


  privates.module = function(domElementId, moduleObject, props) {
    console.time("MagnumJS:init")

    var index = render.roots.indexOf(domElementId);
    if (index < 0) index = render.roots.length;

    //DOM
    var element = document.getElementById(domElementId)
    if (!element) throw new Error('invalid node')
    var parentElement = element.parentNode
    var elementClone = element.cloneNode(true)

    var tempEle = document.createElement("span")
    parentElement.replaceChild(tempEle, element)

    //MODULE
    var mod = module.submodule(moduleObject, [props])

    render.roots[index] = domElementId
    var controller = new mod.controller

    module.controllers[index] = controller
    module.modules[index] = mod
    module.elements[index] = elementClone
    //INTERPOLATIONS
    render.redraw(module)

    //DOM
    parentElement.replaceChild(elementClone, tempEle)

    // call onload if present in controller
    if (controller.onload) controller.onload.call(null, elementClone)
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

  return api
})(mag = mag || {}, mod, render, document);
