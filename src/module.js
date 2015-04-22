;
(function(mag) {

  "use strict";

  var mod = {
    modules: [],
    promises: [],
    deferreds: [],
    controllers: [],
    elements: []
  }

  mod.getController = function(mod, element, fill) {
    var controller

    // FireFox support only
    // Removing since we are now native with Object.observe which is only Chrome & Opera

    if (typeof Proxy !== 'undefined') {
      controller = new Proxy(new mod.controller, {
        get: function(target, prop) {
          if (target[prop] === undefined && ['watchers', 'toJSON', 'called', 'onload', 'onunload'].indexOf(prop) === -1) {
            var a = fill.find(element, prop),
              greedy = prop[0] === '$',
              v, // can be an array, object or string
              // for each
              tmp = []
              a.forEach(function(item, index) {
                if (a[index]) {
                  if (a[index].value && a[index].value.length > 0) {
                    v = a[index].value
                    if (a[index].type && (a[index].type == 'checkbox' || a[index].type == 'radio')) {
                      v = {
                        _text: v,
                        _checked: a[index].checked
                      }
                      tmp.push(v)
                    }
                  } else if (a[index].innerText && a[index].innerText.length > 0) {
                    v = a[index].innerText
                  } else if (a[0].innerHTML && a[index].innerHTML.length > 0) {
                    v = a[index].innerHTML
                  }
                }
              })
              if (tmp.length > 0 && greedy) return tmp
              return v
          }
          return target[prop]
        }
      })
    } else {
      controller = new mod.controller
    }

    //controller = new mod.controller
    return controller
  }

  mod.submodule = function(module, args) {

    var controller = function(args) {
      return (module.controller || function() {}).apply(this, args)
    }.bind({}, args)

    var view = function(ctrl, ele) {

      if (arguments.length > 1) var nargs = args.concat([].slice.call(arguments, 1))
      var template = module.view.apply(module, nargs ? [ctrl].concat(nargs) : [ctrl])

      if (args[0] && args[0].key != null) template.attrs.key = args[0].key
      // There's no template return ??
      //return template
    }
    controller.$original = module.controller

    var output = {
      controller: controller,
      view: view
    }
    if (args[0] && args[0].key != null) output.attrs = {
      key: args[0].key
    }
    return output
  }

  mod.getArgs = function(i) {
    var args = mod.modules[i].controller && mod.modules[i].controller.$$args ? [mod.controllers[i]].concat(mod.modules[i].controller.$$args) : [mod.controllers[i]]
    // args that contaian circular references will throw an exception up the chain
    // TODO: filter for circual references such as DOM nodes
    return args
  }
  mag.mod = mod

})(window.mag || {})
