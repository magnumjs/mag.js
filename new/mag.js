;(function(mag, document, undefined) {

  'use strict'

  var privates = {},
    module = mag.mod,
    render = mag.render,
    fill = mag.fill,
    topModule,
    watch = mag.watch;

  mag.running = false


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
      return store
    }

    return prop
  }


  privates.module = function(domElementId, moduleObject, props) {

    var index = render.roots.indexOf(domElementId)
    // create new index on roots
    if (index < 0) index = render.roots.length;

    //DOM

    var element = document.getElementById(domElementId)
    if (!element) return Error('invalid node')

    // var parentElement = element.parentNode
    // var tempEle = document.createElement("span")
    // parentElement.replaceChild(tempEle, element)

    render.roots[index] = element.id


    //MODULE
    if (!moduleObject.view) return Error('module requires a view')

    var mod = module.submodule(moduleObject, [props || {}])


    var currentModule = topModule = mod = mod || {}
    var controller = new mod.controller


    //this conditional ensures only the last recursive module call is applied
    // REALLY necessary?
    if (currentModule === topModule) {

      module.controllers[index] = controller
      // if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})

      module.modules[index] = mod
      module.elements[index] = element

    }

    //INTERPOLATIONS
    privates.redraw()

    //DOM
    // parentElement.replaceChild(element, tempEle)

    // call controller unloaders ?
    // check if was in previous and now not for the same node
    // add to fill.js



    // console.log(self.running)
    // // call onload if present in controller
    //if (controller.onload && !mag.running) render.callOnload(module)
    return {
      _html: element.innerHTML
    }
    // return instance ?
    // module.controllers[index]
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

  for (var k in api) mag[k] = api[k]

})(window.mag || {}, document)
