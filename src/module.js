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


  mod.getController = function(module, element, fill) {
    var controller

    // FireFox support only
    // Removing since we are now native with Object.observe which is only Chrome & Opera


    if (typeof Proxy !== 'undefined') {
      controller = new Proxy(new module.controller, {
        get: function(target, prop) {
          //more default props like willload, didload, willupdate, didupdate, isupdate
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
      controller = new module.controller
    }

    return controller
  }

  // function deepFreeze(o) {
  //   var prop, propKey;
  //   Object.freeze(o); // First freeze the object.
  //   for (propKey in o) {
  //     prop = o[propKey];
  //     if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
  //       // If the object is on the prototype, not an object, or is already frozen,
  //       // skip it. Note that this might leave an unfrozen reference somewhere in the
  //       // object if there is an already frozen object containing an unfrozen object.
  //       continue;
  //     }

  //     deepFreeze(prop); // Recursively call deepFreeze.
  //   }
  // }

  mod.submodule = function(module, args) {
    // do we need/want this? view/controller will always get the same args
    // difference is that that can't be changed within those functions - does that matter?
    //deepFreeze(args)



    var controller = function() {
        return (module.controller || function() {}).apply(this, args) || this
      },
      view = function(ctrl, ele) {

        if (arguments.length > 1) var nargs = args.concat([].slice.call(arguments, 1))
        module.view.apply(module, nargs ? [ctrl].concat(nargs) : [ctrl])

      },
      output = {
        controller: controller,
        view: view
      }
      // why do we need these?

    //controller.$original = module.controller
    //view.$original = module.view
    controller.$$args = args
    return output
  }

  mod.getArgs = function(i) {
    var args = mod.modules[i] && mod.modules[i].controller && mod.modules[i].controller.$$args ? [mod.controllers[i]].concat(mod.modules[i].controller.$$args) : [mod.controllers[i]]
      // args that contaian circular references will throw an exception up the chain

    attachToArgs(i, args, this.elements[i]);

    return args
  }

  var added = [];

  var attacher = function(i, k, obj, element) {
    var oval = obj[k];
    // only for user input fields
    var found = mag.fill.find(element, k);

    if (typeof oval == 'function' || !found[0] || ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(found[0].tagName) === -1) return;

    Object.defineProperty(obj, k, {
      get: function() {
        var found = mag.fill.find(element, k);
        if (found[0] && found[0].value && found[0].value !== oval) {
          return found[0].value;
        }
        return oval;
      }
    });
  };

  function attachToArgs(i, args, element) {

    // for each property set accessor property

    // get notification when accessed 

    // call fill to get and assign

    if (!added[i]) added[i] = [];

    for (var k in args[0]) {
      if (!added[i][k]) {
        attacher(i, k, args[0], element);
        added[i][k] = true;
      }
    }
  }


  mag.mod = mod

})(window.mag || {})
