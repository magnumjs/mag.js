;
(function(mag) {

  'use strict';



  var mod = {
    modules: [],
    promises: [],
    deferreds: [],
    controllers: [],
    elements: []
  }


  mod.getController = function(index, module) {
    //var controller

    // FireFox support only
    // Removing since we are now native with Object.observe which is only Chrome & Opera

    /*
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
    */

    // get if exists
    if (this.controllers[index]) {
      return this.controllers[index]
    }

    return new module.controller
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


    // TODO: Enforce single call to controllers?

    var controller = function() {
        return (module.controller || function() {}).apply(this, args) || this
      },
      view = function(ctrl, ele) {
        // container element available to sub components
        //TODO: removed until valid use case
        //module.view._nodeId = ele.id


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

    attachToArgs(i, args[0], this.elements[i]);

    return args
  }

  var getParent = function(parts, parentElement) {
    for (var i = 1; i < parts.length; i += 2) {
      var key = parts[i];
      var index = parts[i + 1];
      parentElement = mag.fill.find(parentElement, key);
      // console.log(key, index, parentElement[index])
      parentElement = parentElement[index];
    }
    return parentElement;
  };
  var getElement = function(obj, k, i, parentElement) {

    // search within _key if there
    var parts = i.toString().split('.'),
      found;

    if (parts.length >= 3) {
      // recurse
      parentElement = getParent(parts, parentElement)
      found = mag.fill.find(parentElement, k);

    } else {

      var last = parseInt(parts.pop()),
        index = !isNaN(last) ? last : 0;
      found = mag.fill.find(parentElement[index] ? parentElement[index] : parentElement, k);
    }
    // first user input field
    var founder = isInput(found);
    if (founder && !founder.eventOnFocus) {

      var onfocus = function() {
        if (!this.classList.contains('mag-dirty')) {
          this.classList.add('mag-dirty');
        }
      }

      founder.addEventListener("focus", onfocus, false);
      founder.eventOnFocus = true;
    }
    return founder;
  }

  function isInput(items) {

    for (var k in items) {
      if (items[k] && ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(items[k].tagName) !== -1) {
        return items[k];
      }
    }
    return false;
  }
  var attacher = function(i, k, obj, element) {
    var oval = obj[k];
    // if k =='_value' use parent
    if (k === '_value') k = i.split('.').pop();

    // only for user input fields
    var found = mag.fill.find(element, k);
    var founder = isInput(found);
    if (typeof oval !== 'function' && founder) {

      var founderCall = getElement.bind({}, obj, k, i, element);
      founderCall();
      Object.defineProperty(obj, k, {
        configurable: true,
        get: function() {
          var founder = founderCall();

          // set on focus listener once
          if (founder && founder.value !== 'undefined' && founder.classList.contains('mag-dirty') && founder.value !== oval) {
            oval = founder.value;
            return founder.value;
          }
          return oval;
        },
        set: function(newValue) {
          var founder = founderCall();

          if (founder && founder.value !== 'undefined' && founder.value !== newValue && newValue !== oval) {
            founder.value = newValue;
            oval = newValue;
          }
        }
      });
    }
  };

  function attachToArgs(i, args, element) {

    // for each property set accessor property

    // get notification when accessed 

    // call fill to get and assign

    //if (!added[i]) added[i] = [];
    for (var k in args) {

      var value = args[k]

      if (Array.isArray(value) && value[0] && !value[0].__$$i && typeof value[0].then !== 'undefined' && typeof value[0].type != 'fun') {
        value[0].__$$i = 1

        Promise.all(value).then(function(args, k, val) {
          if (val) {
            value[0].__$$i == 0
            args[k] = val

            mag.redraw()
          }
        }.bind(this, args, k))

      } else

      if (typeof value === 'object' && (!value || typeof value.then === 'undefined')) {
        // recurse
        attachToArgs(i + '.' + k, value, element);
      } else {
        if (value && !Array.isArray(value) && !value.__$$i && typeof value.then !== 'undefined' && typeof value.type != 'fun') {
          value.__$$i = 1
            // promise
          value.then(function(args, k, val) {
            if (val) {
              args[k].__$$i = 0
              args[k] = val
              mag.redraw()
            }
          }.bind(this, args, k))

        }

        //if (!added[i][k]) {
        attacher(i, k, args, element);
        //  added[i][k] = true;
        // }
      }
    }
  }



  mag.mod = mod

})(window.mag || {})
