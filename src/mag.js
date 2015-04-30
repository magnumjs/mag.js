;
(function(mag, document, undefined) {

  'use strict'

  var module = mag.mod,
    render = mag.render,
    fill = mag.fill,
    topModule,
    type = {}.toString,
    FUNCTION = 'function',
    OBJECT = '[object Object]';

  mag.running = false

  var redrawing = false
  mag.redraw = function(force) {
    if (redrawing) {
      // do we ever get here?
      // necessary?
      return
    }
    redrawing = true
    render.redraw(module || render.module || {}, fill, force)
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
        // Is a redraw here necessary?
        mag.redraw()
      }
      return store
    }

    // do we still need this?
    // TODO: value hookin?
    prop.type = 'fun'

    prop.toJSON = function() {
      // return a copy
      if(store && store.nodeType){
        //make sure no circular references
      
        return fill.elementToObject(store)
      }
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
    attributes: [],
    elementMatcher: []
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

  var topComponent
  mag.module = function(domElementId, moduleObject, props, clone) {

    var index = render.roots.indexOf(domElementId)

    //UNLOADERS that exist?
    //if (index > -1 && unloaderer(index, domElementId)) return

    // clear cache if exists
    if (props && !props.retain) render.clear(index, domElementId, fill)

    // create new index on roots
    if (index < 0 || clone) index = render.roots.length;


    //DOM
    var element = document.getElementById(domElementId)
    if (!element) throw Error('Mag.JS Module - invalid node id: ' + domElementId)


    render.roots[index] = element.id

    //MODULE
    if (!moduleObject.view) throw Error('Mag.JS module - requires a view: ' + JSON.stringify(moduleObject))

    // TODO: should props be frozen or changeable?
    var mod = module.submodule(moduleObject, [Object.freeze(props || {})])

    var controller = module.getController(mod, element, fill)

    module.controllers[index] = controller

    if (controller.onunload) render.unloaders.push({
      controller: controller,
      handler: controller.onunload
    })


    module.modules[index] = mod
    
    module.elements[index] = clone ? element.cloneNode(true): element
    module.elements[index].cloner = clone

    module.promises[index] = new Promise(function(resolve, reject) {
      module.deferreds[index] = arguments
      // call onload if present in controller
      // if (controller.onload && !mag.running) render.callOnload(module)
    }.bind({}, clone, index))

    //INTERPOLATIONS
    mag.redraw()


    // call controller unloaders ?
    // check if was in previous and now not for the same node
    // add to fill.js


    // interpolations haven't occurred yet
    // return a promise in a settergetter


    // return {
    //   promise: module.promises[index],
    //   html :{_html: fill.cloneNodeWithEvents(module.elements[index]) }
    // }

// return propify(module.promises[index], {
//       _html: module.elements[index].innerHTML
//     })

    return propify(module.promises[index], {
     // _html: fill.cloneNodeWithEvents(module.elements[index])
     _html : mag.prop(module.elements[index] )
      // _html: function(){ return module.elements[index] }
    })

  }

})(window.mag || {}, document)
