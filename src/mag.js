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

  function runPromise(index, controller, clone) {

    if (controller.onunload) render.unloaders.push({
      controller: controller,
      handler: controller.onunload
    })

    module.promises[index] = new Promise(function(resolve, reject) {
      module.deferreds[index] = arguments
        // call onload if present in controller
        // if (controller.onload && !mag.running) render.callOnload(module)
    }.bind({}, clone))

    //INTERPOLATIONS
    mag.redraw()
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


  mag.module = function(domElementId, moduleObject, props, clone) {

    // generate / reuse key for each module call

    var props = props || {}

    var index = render.roots.indexOf(domElementId)

    //UNLOADERS that exist?
    if (index > -1 && reloader(index, domElementId)) return


    // clear cache if exists
    if (!props.retain) render.clear(index, domElementId, fill)

    if (index > -1 && typeof props.key == 'undefined' && clone) {
      //console.log(domElementId, index)
      props.key = (index + 1)
    }

    var nextIndex;

    // create new index on roots
    if (index < 0) {
      nextIndex = render.roots.length;
      props.key = typeof props.key != 'undefined' ? props.key : nextIndex
    }

    var rendVal = index > -1 && typeof props.key != 'undefined' ? domElementId + props.key : domElementId + props.key;



    //console.log(props.key, index, domElementId, rendVal, render.roots)


    // already exists
    if (render.roots.indexOf(rendVal) >= 0) {

      //console.log('REUSING EXISTING', rendVal)

      var index = render.roots.indexOf(rendVal)

      return runPromise(index, module.controllers[index], clone);

    }
    if (render.roots.indexOf(rendVal) < 0) {
      if (index < 0) {
        index = render.roots.length;
      } else {

        // console.log('CREATE NEW FROM EXISTING', index, props.key)

      }
      //console.log('CREATING', index, rendVal)
      var element = document.getElementById(domElementId)

      if (!element) throw Error('Mag.JS Module - invalid node id: ' + domElementId)

      render.roots[index] = rendVal


      //MODULE
      if (!moduleObject.view) throw Error('Mag.JS module - requires a view: ' + domElementId + moduleObject)

      //if parent then give info to current
      // TODO: removed until valid use case
      // if (mag.module.caller) {
      //   props._parentId = mag.module.caller._nodeId
      // }

      // TODO: should props be frozen or changeable?
      var mod = module.submodule(moduleObject, [props])

      var controller = module.getController(index, mod, element, fill)

      module.controllers[index] = controller


      module.modules[index] = mod

      module.elements[index] = clone ? element.cloneNode(true) : element
      module.elements[index].cloner = clone

      return runPromise(index, controller, clone);
    }
  }

})(window.mag || {}, document)
