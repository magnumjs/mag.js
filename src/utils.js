/*
MagJS v0.27.3
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/

(function(mag) {

  'use strict';

  var utils = {};

  utils.isObject = function(obj) {
    //For Safari
    return Object.prototype.toString.call(obj).substr(-7) == 'Object]';
  }

  utils.isEmpty = function(obj) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) return 0;
    }
    return 1;
  }

  utils.isHTMLEle = function(item) {
    return item && item.nodeType === 1;
  }

  utils.callHook = function(hookins, key, name, i, data, before) {
    if (hookins[name][i].key == key) {
      before = {
        v: data.value,
        k: data.key
      }
      data.change = false;
      hookins[name][i].handler.call(hookins[name][i].context, data);
      //if any change
      if (before !== {
          v: data.value,
          k: data.key
        }) {
        data.change = true
      }
    }
  }


  var queue = [],
    scheduled = [];

  utils.scheduleFlush = function(id, fun) {
    return new Promise(function(resolve) {
      if (mag.rafBounce || mag.rafBounceIds[id]) {
        cancelAnimationFrame(scheduled[id]);
        scheduled[id] = requestAnimationFrame(function() {
          fun();
          resolve();
          scheduled[id] = 0;
        })
      } else {
        // queue[id] = queue[id] || [];
        queue.push(fun);
        if (!scheduled[id]) {
          scheduled[id] = requestAnimationFrame(function() {
            scheduled[id] = 0;
            var task;
            while (task = queue.shift()) task();
            resolve();
            //WHY? If the batch errored we may still have tasks queued
            // if (queue[id].length) utils.scheduleFlush(id);
          })
        } else {
          resolve()
        }
      }
    })
  }

  var handlers = []
  utils.onLCEvent = function(eventName, index, handler) {
    var eventer = eventName + '-' + index;
    handlers[eventer] = handlers[eventer] || []
    var size = handlers[eventer].push(handler);
    //Remove self:
    return function() {
      return handlers[eventer].splice(size - 1, 1)
    }
  }
  utils.callLCEvent = function(eventName, controller, node, index, once, extra) {
    var isPrevented;
    utils.runningEventInstance = index;
    var props = mag.mod.getProps(index);
    if (controller && controller[eventName]) {
      isPrevented = controller[eventName].call(controller, node, props, index, extra)
      if (once) controller[eventName] = 0
    }

    // on Handlers
    var eventer = eventName + '-' + index;
    if (handlers[eventer]) {
      for (var handle of handlers[eventer]) {
        handle(controller, props);
      }
      if (once) handlers[eventer] = 0
    }
    utils.runningEventInstance = -1;
    if (isPrevented === false) return true;
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
      return ~a.i.indexOf(id)
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

}(mag));
