/*
MagJS v0.20
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
    modules[index][1] = new output.controller
    modules[index][3] = id

    // register the module
    return modules[index]
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
