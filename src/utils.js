/*
MagJS v0.23.5
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/

(function(mag) {

  'use strict';

  var utils = {};

  utils.callHook = function(hookins, key, name, i, data, before) {
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

  utils.unloaders = []
  var handlers = []
  utils.onLCEvent = function(eventName, index, handler) {
    handlers[eventName + '-' + index] = handler
  }
  utils.callLCEvent = function(eventName, controller, node, index, once, extra) {
    var isPrevented = false,
      event = {
        preventDefault: function() {
          isPrevented = true
        }
      }

    if (controller && controller[eventName]) {
      controller[eventName].call(controller, event, node, mag.mod.getProps(index), index, extra)
      if (once) controller[eventName] = 0
    }

    // on Handlers
    handlers[eventName + '-' + index] && handlers[eventName + '-' + index](mag.mod.getState(index), mag.mod.getProps(index));

    return isPrevented
  }

  //UTILITY
  utils.copy = function(o) {
    return Object.assign({}, o);
  }

  utils.merge = function() {
    return Object.assign.apply({}, arguments);
  }

  var a = {
    i: [],
    isItem: function(id) {
      return a.i.indexOf(id) > -1
    },
    setItem: function(id) {
      a.i[a.i.length] = id
    },
    getItem: function(id) {
      return a.i.indexOf(id)
    },
    getItemVal: function(index) {
      return a.i[index]
    },
    removeItem: function(id) {
      a.i.splice(a.i.indexOf(id), 1)
    }
  }

  utils.items = a

  utils.getItemInstanceIdAll = function() {
    return a.i
  }

  utils.getItemInstanceId = function(id) {
    if (a.isItem(id)) {
      return a.getItem(id)
    } else {
      a.setItem(id)
      return a.getItem(id)
    }
  }


  mag.utils = utils

}(window.mag || {}));
