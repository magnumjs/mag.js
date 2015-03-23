var render = {
  roots: [],
  templates: {}
}
var runs = {}
render.redraw = function(module) {
  this.fun || (this.fun = debounce(function() {
    for (var i = 0, root; root = render.roots[i]; i++) {
      if (module.controllers[i]) {

        var elementClone = module.elements[i]
        var args = module.getArgs(i)

        module.modules[i].view(elementClone, module.controllers[i], args)

        Object.observe(args[0], debounce(function(elementClone, i, module, changes) {
          var args = module.getArgs(i)
          render.interpolate(elementClone, args[0])
        }.bind(null, elementClone, i, module)))

        render.interpolate(elementClone, args[0])
      }
    }
  }))
  this.fun()
}

render.isTypeOf = function(type, thing) {
  if (this.toString.call(thing) === '[object ' + type + ']') {
    return true
  }
}
render.types = ['Array', 'String', 'Object', 'Function']

render.interpolate = function(elementClone, data) {
  console.log('called')
  for (var prop in data) {

    if (render.isTypeOf('Array', data[prop])) {
      // loop
      // recursive
      if (render.cache[prop] != JSON.stringify(data[prop])) {
        // get element to clone
        var eles = domElement.findByKey(elementClone, prop)
        if (eles.length < 1) continue;

        var template
        var myNode = eles[0].item(elementClone).parentNode

        if (!render.templates[prop]) {
          template = eles[0].item(elementClone).cloneNode(true)
          //save template
        } else {
          // remove all existing node
          // do a diff?

          while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild)
          }
          template = render.templates[prop]
        }

        for (var i = 0; i < data[prop].length; i++) {

          var newest = template.cloneNode(true);
          var val = data[prop][i];

          // simple list no sub objects or functions

          domElement.setTextContent(newest, val)

          myNode.appendChild(newest)
        }
        if (!render.templates[prop]) {
          render.templates[prop] = template

          myNode.removeChild(eles[0].item(elementClone))
        }
        render.cache[prop] = JSON.stringify(data[prop])
      }
    } else if (render.isTypeOf('Object', data[prop])) {
      // don't run twice unceccesarily
      // has this keys values change since the previous call
      //check the cache
      if (render.cache[prop] != JSON.stringify(data[prop])) {
        handleObject(elementClone, prop, data[prop])
        render.cache[prop] = JSON.stringify(data[prop])
      }
    } else if (!render.isTypeOf('Function', data[prop])) {
      if (render.cache[prop] != JSON.stringify(data[prop])) {
        domElement.val(elementClone, prop, data[prop])
        render.cache[prop] = JSON.stringify(data[prop])
      }
    }
  }
}

var debounce = function(fn, threshhold) {
  var last, threshhold = threshhold || 250,
    deferTimer

  return function() {

    var now = +new Date

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fn.apply(this, arguments);
      }, threshhold);
    } else {
      last = now
      fn.apply(this, arguments);
    }
  }
}

  function handleObject(node, key, object) {
    // get all keys with _ "underscore"
    var attrs = {}
    Object.keys(object).forEach(function(k, i) {
      if (k.substr(0, 1) == '_') {
        attrs[k.substr(1)] = object[k]
      }
    })

    domElement.event(node, key, attrs)
    domElement.setAttrs(node, key, attrs)
    // set all key vals
    for (var k in object) {
      // if starts with underscore its an attribute
      domElement.replaceWithin(node, k, object[k])
    }
  }

render.cache = {}
