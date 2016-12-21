/*
MagJS v0.24.3
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag) {

  'use strict';


  var modules = [],
    controllers = []

  var mod = {
    innerMods: [],
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
      // update props, merge with existing if same key
      if (props.key && props.key === mod.getProps(index).key) {
        mod.setProps(index, mag.utils.copy(mag.utils.merge(mod.getProps(index), props)));
      } else {
        mod.setProps(index, props);
      }

      // reinitialize the controller ?
      return modules[index]
    }
    modules[index] = [0, 0, 0, 0, 0]
    mod.setProps(index, props)
    var controller = function(context) {
        return (module.controller || function() {}).call(context, mod.getProps(index)) || context
      },
      view = function(index, state, ele) {
        module.view && module.view.call(module, state, mod.getProps(index), ele)
      }.bind({}, index),
      output = {
        controller: controller,
        view: view
      }
    modules[index][0] = output.view;
    modules[index][3] = id;
    modules[index][1] = getController(output.controller, index, id);
    // register the module
    return modules[index]
  }

  var timers = [];
  var prevs = [];

  function findMissing(change, element) {
    var prop = change.name;
    if (typeof change.object[change.name] == 'undefined') {
      // prop might be hierarchical?
      // getparent Object property chain?

      // get value of property from DOM
      var a = mag.fill.find(element, prop),
        greedy = prop[0] === '$',
        v, // can be an array, object or string
        // for each
        tmp = [];

      a.reverse().forEach(function(item, index) {
        if (item) {
          if (item.value && item.value.length > 0) {
            v = item.value
            if (item.type && (item.type == 'checkbox' || item.type == 'radio')) {
              v = {
                _value: v
              };
              if (item.checked) v._checked = true
              tmp.push(v)
            }
          } else if (item.innerText && item.innerText.length > 0) {
            v = item.innerText
          } else if (item.innerHTML && item.innerHTML.length > 0) {
            v = item.innerHTML
          } else if (!item.value && item.tagName == 'INPUT') {
            v = ''
          }
        }
      })
      if (tmp.length > 0 && greedy) return tmp
      return v
    }
  }


  var handler = function(type, index, change) {

    var current = JSON.stringify(change.object);
    var sname = String(change.name);
    if (current === prevs[index + sname]) {
      return;
    }
    prevs[index + sname] = current;

    if (change.type == 'get' && type != 'props' && !~mag.fill.ignorekeys.indexOf(change.name.toString()) && typeof change.oldValue == 'undefined' && Object.keys(change.object).length === 0) {
      var res = findMissing(change, mag.doc.getElementById(mod.getId(index)));
      if (typeof res != 'undefined') {
        mod.cached[index] = 0;
        return res;
      }
    } else if (change.type == 'set' && type != 'props' && change.object[change.name] && change.object[change.name].draw && typeof change.object[change.name].draw == 'function') {

      // setting a state prop to a module

      // call unloader for module
      mod.innerMods[mod.getId(index)] = [change.name, change.object[change.name]];
    }


    // call setup handler
    var fun = mod.getFrameId(index);
    if (typeof fun == 'function' && change.type == 'set') {
      //debounce
      cancelAnimationFrame(timers[index]);
      timers[index] = requestAnimationFrame(fun);
    }

  };


  function getController(ctrl, index, id) {
    var controller;
    if (typeof Proxy !== 'undefined') {

      mod.setProps(index, mag.proxy(mod.getProps(index), handler.bind({}, 'props', index)));

      controller = new ctrl(mag.proxy({}, handler.bind({}, 'state', index)));
    } else {
      controller = new ctrl({})
    }

    return controller;
  }

  mod.iscached = function(key) {
    var data = mag.utils.merge(mag.utils.copy(mod.getProps(key)), mod.getState(key));
    if (mod.cache[key] && mod.cache[key] === JSON.stringify(data)) {
      return true
    }
    mod.cache[key] = JSON.stringify(data);
  }

  mod.clear = function(key) {
    if (key > -1 && mod.cache[key]) {
      mod.cache.splice(key, 1);
    }
  }

  mod.cached = [];
  mod.callView = function(node, index) {

    if (!mod.cached[index]) {
      mag.props.attachToArgs(index, mod.getState(index), node)
      mod.cached[index] = 1
    }
    mod.getView(index)(mod.getState(index), node)
  }


  mag.mod = mod;


}(mag));
