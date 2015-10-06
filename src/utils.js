/*
MagJS v0.20
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
  utils.callLCEvent = function(eventName, controller, node, index, once) {
    var isPrevented = false,
      event = {
        preventDefault: function() {
          isPrevented = true
        }
      }
    if (controller && controller[eventName]) {
      controller[eventName].call(controller, event, node, mag.mod.getProps(index))
      if (once) controller[eventName] = 0
    }

    if (isPrevented) {
      // unloading

      for (var i = 0, unloader; unloader = utils.unloaders[index][i]; i++) {

        if (unloader.controller.onunload) {
          unloader.handler.call(unloader.controller, node)
          unloader.controller.onunload = 0
        }
      }
    }

    return isPrevented
  }

  //UTILITY
    utils.copy=function(o){
      // will strip functions
      return JSON.parse(JSON.stringify(o))
    }

  utils.copyFun = function(o) {
    var out, v, key;
    out = Array.isArray(o) ? [] : {};
    for (key in o) {
      v = o[key];
      out[key] = (typeof v === "object") ? utils.copy(v) : typeof v == 'function' && v.type == 'fun' ? mag.prop(v()) : v;
    }
    return out;
  }

  utils.merge = function(destination, source) {
    for (var p in source) {
      if (source[p] && source[p].constructor == Object && source.hasOwnProperty(p)) {
        if (typeof destination[p] !== 'object') {
          destination[p] = {}
        }
        if (destination[p]) {
          utils.merge(destination[p], source[p]);
          continue;
        }
      }
      destination[p] = source[p];
    }
    return destination
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


  mag.debounce = function(func, wait, immediate) {
    wait || (wait = 16)
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  mag.prop = function(store) {
    var prop = function() {
      if (arguments.length) store = arguments[0];
      return store;
    };

    prop.toJSON = function() {
      return store;
    };
    prop.type = 'fun'
    return prop;
  };

  mag.withProp = function(prop, withAttrCallback) {
    return function(e) {
      e = e || event;
      var currentTarget = e.currentTarget || this;
      withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
    }
  }

}(window.mag || {}));
