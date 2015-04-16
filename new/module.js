;
(function(mag) {

  "use strict";

  var mod = {
    modules: [],
    controllers: [],
    elements: []
  }

  mod.getController = function(mod, element, fill) {
    var controller

    // FireFox support only
    if (typeof Proxy !== 'undefined') {
      controller = new Proxy(new mod.controller, {
        get: function(target, prop) {
          if (target[prop] === undefined && ['watchers', 'toJSON', 'called', 'onload', 'onunload'].indexOf(prop) === -1) {
            var a = fill.find(element, prop),
              v
            if (a[0]) {
              if (a[0].value && a[0].value.length > 0) {
                v = a[0].value
                if (a[0].type && a[0].type == 'checkbox') {
                  v = {
                    _text: v,
                    _checked: a[0].checked
                  }
                }
              }
              if (a[0].innerText && a[0].innerText.length > 0)
                v = a[0].innerText
              if (a[0].innerHTML && a[0].innerHTML.length > 0)
                v = a[0].innerHTML
            }
            return v
          }
          return target[prop]
        }
      })
    } else {
      controller = new mod.controller
    }
    return controller
  }

  mod.submodule = function(module, args) {
    var controller = function(args) {
      return (module.controller || function() {}).apply(this, args)
    }.bind({}, args)

    var view = function(ctrl) {
      if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
      var template = module.view.apply(module, args ? [ctrl].concat(args) : [ctrl])
      if (args[0] && args[0].key != null) template.attrs.key = args[0].key
      // There's no template return ??
      return template
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
    return args
  }
  mag.mod = mod

})(window.mag || {})
