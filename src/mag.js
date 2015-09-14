;
(function(mag, document, undefined) {

  'use strict';

  var module = mag.mod,
    render = mag.render,
    fill = mag.fill,
    type = {}.toString,
    FUNCTION = 'function',
    OBJECT = '[object Object]',
    redrawing = false,
    hookins = {
      attributes: [],
      elementMatcher: []
    }
  mag.redrawing = false
  mag.redraw = function(force) {
    if (mag.redrawing) {
      return
    }
    mag.redrawing = true
    render.redraw(module || render.module || {}, fill, force)
  }

  mag.withProp = function(prop, withAttrCallback) {
    return function(e) {
      e = e || event;
      var currentTarget = e.currentTarget || this;
      withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
    }
  }

  mag.prop = function(store, custom) {

    if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
      return propify(store, custom)
    }

    return gettersetter(store, custom)
  }

  function gettersetter(store, custom) {
    var prop = function() {
      if (arguments.length) {
        store = arguments[0]
          // too much ?
        mag.redraw()
      }
      return store
    }



    // do we still need this?
    // TODO: value hookin?
    prop.type = 'fun'
      // extra custom data to pass - used by the unloader event
    prop.data = custom ? custom : null

    prop.toJSON = function() {
      // return a copy
      if (store && store.nodeType) {
        //make sure no circular references
        //return store.innerHTML
        return fill.elementToObject(store)
      }
      return store
    }

    return prop
  }

  function propify(promise, initialValue, custom) {
    var prop = mag.prop(initialValue, custom);
    promise.then(prop);
    //console.log(prop.data, prop()._html.data)
    prop.then = function(resolve, reject) {
      return propify(promise.then(resolve, reject), initialValue)
    };
    return prop
  }


  mag.hookin = function(name, key, handler) {
    hookins[name].push({
      context: {},
      handler: handler,
      key: key
    })
  }

  function callHook(key, name, i, data, before) {
    data.change = false
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

  mag.hook = function(name, key, data) {
    for (var i = 0, size = hookins[name].length; i < size; i++) {
      callHook(key, name, i, data)
    }
  }
  var reloader = function(index, domElementId) {
    //console.log('reloaded', index, domElementId)
    // remove cache ?
    //delete render.cache[index]
    //console.log(render.cache[index] ? JSON.parse(render.cache[index]) : 'no cache')
    render.callLCEvent('onreload', module, index)
  }

  mag.module = function(domElementId, moduleObject, props, clone) {

    var index = render.roots.indexOf(domElementId)


    //console.log('module called', index, domElementId, render.roots)

    //UNLOADERS that exist?
    if (index > -1 && reloader(index, domElementId)) return

    // clear cache if exists
    if (props && !props.retain) render.clear(index, domElementId, fill)

    // create new index on roots
    if (index < 0 || clone) index = render.roots.length;

    //DOM
    var element

    // search for sub element within parent ?
    if (mag.viewElement) {
      element = mag.viewElement.querySelector('#' + domElementId)
    }

    if (!element) element = document.getElementById(domElementId)

    if (!element) throw Error('Mag.JS Module - invalid node id: ' + domElementId)


    render.roots[index] = domElementId

    //MODULE
    if (!moduleObject.view) throw Error('Mag.JS module - requires a view: ' + domElementId + moduleObject)

    // TODO: should props be frozen or changeable?
    var mod = module.submodule(moduleObject, [props || {}])

    var controller = module.getController(mod, element, fill)

    module.controllers[index] = controller

    if (controller.onunload) render.unloaders.push({
      controller: controller,
      handler: controller.onunload
    })


    module.modules[index] = mod

    module.elements[index] = clone ? element.cloneNode(true) : element
    module.elements[index].cloner = clone

    module.promises[index] = new Promise(function(resolve, reject) {
      module.deferreds[index] = arguments
        // call onload if present in controller
        // if (controller.onload && !mag.running) render.callOnload(module)
    }.bind({}, clone))

    //INTERPOLATIONS
    mag.redraw()





    // call controller unloaders ?
    // check if was in previous and now not for the same node
    // add to fill.js


    // interpolations haven't occurred yet
    // return a promise in a settergetter



    return propify(module.promises[index], {
      // _html: fill.cloneNodeWithEvents(module.elements[index])
      _html: mag.prop(module.elements[index])
        // _html: function() {
        // return module.elements[index]
        // }
    }, {
      type: 'module',
      id: index
    })

  }

})(window.mag || {}, document)
