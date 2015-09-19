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

  mag.count = []

  function getRendVal(domElementId, index, clone, props) {
    if (index > -1 && typeof props.key == 'undefined' && clone) {
      //console.log(domElementId, index)
      //props.key = index
    }




    //if parent then give info to current
    // TODO: removed until valid use case
    // if (mag.module.caller) {
    //   props._parentId = mag.module.caller._nodeId
    // }
    //var fid = domElementId + '.' + parentId;
    var fid = fill.count[domElementId]
    if (index < 0 && clone && typeof props.key == 'undefined' && fid) {

      if (!mag.count[domElementId]) mag.count[domElementId] = {}
      mag.count[domElementId].key++
        //count[domElementId].times++

        if (fid && mag.count[domElementId].size != fid[0]) {
          //console.log('AMOUNT', fill.count[fid])
          mag.count[domElementId].key = 0
        }
      mag.count[domElementId].size = fid && fid[0]
      props.key = mag.count[domElementId].key

      //console.log(domElementId, props.key, fid)

      /*
      // search children for first comment with
      var r = parent.querySelectorAll('[id^=__magnum__' + domElementId + ']')
      // remove items / length that don't have the same parentId at the end of the string
      var size=0
      for(var j in r){
        if(r[j].id && r[j].id.split('.').pop() == parentId){
          size++
        }
      }

      if (!count[domElementId]) count[domElementId] = {
        size: size,
        times: 0,
        keys: 0
      }
      count[domElementId].key++
        count[domElementId].times++
        if (typeof count[domElementId].size != 'undefined' && count[domElementId].size != r.length) {
          //console.log('AMOUNT', r.length)
          count[domElementId].key = 0
        }
      count[domElementId].size = r.length
      props.key = count[domElementId].key
      */
      //console.log(count[domElementId].times, domElementId, count[domElementId], props.key)

    }
    var nextIndex;

    // create new index on roots
    if (index < 0) {
      nextIndex = render.roots.length;
      props.key = typeof props.key != 'undefined' ? props.key : nextIndex
    }


    var rendVal = index > -1 && typeof props.key != 'undefined' ? domElementId + '.' + props.key : domElementId + '.' + props.key;
    return rendVal
  }

  // function findIndex(a, test) {
  //   var found = -1
  //   a.every(function(n, k) {
  //     var index = n.split('.')[0] == test ? 0 : -1
  //     index > -1 ? found = k : 0
  //     return index < 0;
  //   });
  //   return found;
  // }

  mag.module = function(domElementId, moduleObject, props, clone) {


    //MODULE
    if (!moduleObject.view) throw Error('Mag.JS module - requires a view: ' + domElementId + moduleObject)


    // generate / reuse key for each module call

    var props = props || {}

    /*
    var   parentMod;
    try {
      throw new Error();
    } catch (e) {
      var st = e.stack,
        lines = st.split("\n");
      for (var k in lines) {
        if (lines[k].indexOf && lines[k].indexOf('.view') > -1 && lines[k].indexOf(' ') > -1) {
          //console.log(lines[k].trim().split(' ')[1])
          parentMod = lines[k].trim().split(' ')[1].split('.')[1]
            //console.log(parentMod)
          break;
        }
      }
    }
    //get parentmod index
    var pindex, parentId;
    if (module.modules && parentMod) {
      pindex = findIndex(render.roots, parentMod)
        //console.log('PARENTMOD', domElementId, parentMod, pindex)
      parentId = module.modules[pindex] ? module.modules[pindex].id : 0
        // console.log(parentId)
        //var pid = document.getElementById(parentMod)
        //  if (pid) parent = pid
    }
*/

    var index = render.roots.indexOf(domElementId)

    //UNLOADERS that exist?
    if (index > -1 && reloader(index, domElementId)) return


    // clear cache if exists
    if (!props.retain) render.clear(index, domElementId, fill)

    var rendVal = getRendVal(domElementId, index, clone, props)


    //console.log(props.key, index, domElementId, rendVal,parentMod)


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
      // DOM
      var element = document.getElementById(domElementId)

      if (!element) throw Error('Mag.JS Module - invalid node id: ' + domElementId)

      render.roots[index] = rendVal


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
