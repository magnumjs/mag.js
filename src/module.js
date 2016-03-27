/*
MagJS v0.22.1
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag) {

  'use strict';


  var modules = [],
    controllers = []

  var mod = {
    cache: []
  }

  mod.getState = function(index) {
    return modules[index][1]
  }
  mod.setState = function(index, state) {
    modules[index][1] = state
  }
  mod.getView = function(index) {
    return modules[index][0]
  }
  mod.getProps = function(index) {
    return modules[index][2]
  }
  mod.setProps = function(index, props) {
    return modules[index][2] = props
  }
  mod.remove = function(index) {
    modules.splice(index, 1)
  }
  mod.getId = function(index) {
    return modules[index] && modules[index][3]
  }
  mod.exists = function(index) {
    return typeof modules[index] != 'undefined' ? true : false
  }
  mod.setFrameId = function(index, fid) {
    modules[index][4] = fid;
  }
  mod.getFrameId = function(index) {
    return modules[index][4];
  }
  mod.submodule = function(id, index, module, props) {
    if (modules[index]) {
      // new call to existing
      // update props
      mod.setProps(index, props)
        // reinitialize the controller ?
      return modules[index]
    }
    modules[index] = [0, 0, 0, 0, 0]
    mod.setProps(index, props)
    var controller = function() {
        return (module.controller || function() {}).call(this, mod.getProps(index)) || this
      },
      view = function(index, state, ele) {
        module.view.call(module, state, mod.getProps(index), ele)
      }.bind({}, index),
      output = {
        controller: controller,
        view: view
      }
    modules[index][0] = output.view
    modules[index][1] = getController(output.controller, index, id)
    modules[index][3] = id

    // register the module
    return modules[index]
  }

  var ignorekeys = ['Symbol(Symbol.toStringTag)', 'nodeType', 'toJSON', 'onunload', 'onreload', 'willupdate', 'didupdate', 'didload', 'willload', 'isupdate'];


  function getController(ctrl, index, id) {
    var controller, element = document.getElementById(id);
    if (typeof Proxy !== 'undefined') {
      controller = new Proxy(new ctrl, {
        get: function(target, prop) {
          //more default props like willload, didload, willupdate, didupdate, isupdate
          if (target[prop] === undefined && !~ignorekeys.indexOf(prop.toString())) {
            // get value of property from DOM
            // might be hierarchical?
            var a = mag.fill.find(element, prop),
              greedy = prop[0] === '$',
              v, // can be an array, object or string
              // for each
              tmp = [];

            a.reverse().forEach(function(item, index) {
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
      controller = new ctrl
    }

    return controller;
  }

  mod.iscached = function(key, data) {
    if (mod.cache[key] && mod.cache[key] === JSON.stringify(data)) {
      return true
    }
    mod.cache[key] = JSON.stringify(data)
  }

  mod.clear = function(key) {
    if (key > -1 && mod.cache[key]) {
      mod.cache.splice(key, 1)
    }
  }
  var cached = []
  mod.callView = function(node, index) {

    var module = mod.getView(index)

    if (!cached[index]) {
      mag.props.attachToArgs(index, mod.getState(index), node)
      cached[index] = 1
    }
    module(mod.getState(index), node)
  }


  mag.mod = mod;


}(window.mag || {}));
