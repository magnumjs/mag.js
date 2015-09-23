/*
MagJS v0.17
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag) {

  'use strict';


  var modules = [],
    cache = [],
    controllers = []

  var mod = {}

  mod.getState = function(index) {
    return modules[index][1]
  }
  mod.setState = function(index, state) {
    modules[index][1] = state
  }
  mod.getView = function(index) {
    return modules[index][0]
  }

  mod.submodule = function(index, module, props) {
    if (modules[index]) return modules[index]
    var controller = function() {
        return (module.controller || function() {}).call(this, [].concat(props)[0]) || this
      },
      view = function(state, ele) {
        module.view.call(module, state, [].concat(props)[0], ele)
      },
      output = {
        controller: controller,
        view: view
      }

    // register the module
    return modules[index] = [output.view, new output.controller]
  }


  mod.iscached = function(key, data) {
    if (cache[key] && cache[key] === JSON.stringify(data)) {
      return true
    }
    cache[key] = JSON.stringify(data)
  }


  mod.callView = function(node, index) {

    var module = mod.getView(index)

    mag.prop.attachToArgs(index, mod.getState(index), node)

    module(mod.getState(index), node)
  }


  mag.mod = mod;


}(window.mag || {}));
