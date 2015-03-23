var mag = (function(self, module, render, document, undefined) {

  'use strict'

  var privates = {}

  privates.init = function(container, data) {
    if (!(this instanceof privates.init)) return new privates.init(container, data);
    var instance = this;
    console.log('mag init')
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
      return store
    }

    return prop
  }

  privates.h = function(attrs, stringOrChildrenArray) {
    // attrs are html element attributes
    // string is the text to set or an array of children
    // h({onchange:function(){}, value:'test'},'content')
    var h = function() {
      return {
        attrs: attrs
      }
    }
    h._type = 'vdom'
    return h
  }
  privates.module = function(domElementId, moduleObject, props) {
    console.time("MagnumJS")

    var index = render.roots.indexOf(domElementId);
    if (index < 0) index = render.roots.length;

    //DOM
    var element = document.getElementById(domElementId)

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
    if (controller.onload) controller.onload.call()
    console.timeEnd("MagnumJS")
  }

  var interfaces = function(method) {
    return function() {
      return privates[method].apply(this, arguments)
    }
  }

  var api = interfaces('init')

  api['module'] = interfaces('module')
  api['h'] = interfaces('h')
  api['prop'] = interfaces('prop')

  return api
})(mag = mag || {}, mod, render, document);
