var mag = (function(self, document, undefined) {

  'use strict'

  var privates = {},
    module = self.mod,
    render = self.render,
    fill = self.fill,
    topModule,
    watch = mag.watch;

  // REMOVE THIS? why is this here?
  privates.init = function(container, data) {

    // if (!(this instanceof privates.init)) return new privates.init(container, data)
    // var instance = this
    // console.log('mag init')
  }

  privates.redraw = function() {
    render.redraw(module || render.module || {}, fill, watch)
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
    if (!moduleObject.view) throw new Error('view is required')
    var mod = module.submodule(moduleObject, [props])


    render.roots[index] = domElementId
    var controller = new mod.controller

    module.controllers[index] = controller
    module.modules[index] = mod
    module.elements[index] = elementClone
    //INTERPOLATIONS
    privates.redraw()

    //DOM
    parentElement.replaceChild(elementClone, tempEle)
  
    // call controller unloaders ?


    // call onload if present in controller
    if (controller.onload) controller.onload.call(null, elementClone)

    // var currentModule = topModule = mod = mod || {};
    // var constructor = mod.controller || function() {}
    // var controller = new constructor;
    // // controller._type='__mag__.module'
    // // controller._ele = domElementId
    // //controllers may call m.module recursively (via m.route redirects, for example)
    // //this conditional ensures only the last recursive m.module call is applied
    // if (currentModule === topModule) {
    //   module.controllers[index] = controller;
    //   module.modules[index] = mod
    // }
    
    return {_type:'__mag__.module', _ele : domElementId}
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

  return api

}(window.mag || {}, document))
