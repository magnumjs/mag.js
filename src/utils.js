/*
MagJS v0.29.5
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/

(function(mag) {

  'use strict';

  var utils = {};

  //UTILITY
  utils.copy = obj => Object.assign({}, obj)

  utils.merge = function() {
    return Object.assign.apply({}, arguments);
  }

  utils.extend = function(target, source, deep) {
    //if the sources are undefined then don't add to target even if exists
    for (var k in source) {
      if (source[k] === undefined) {
        delete source[k];
      } else if (deep && utils.isObject(source[k])) {
        return utils.extend(target[k], source[k])
      }
    }
    return utils.merge(target, source)
  }

  //For Safari
  utils.isObject = obj => Object.prototype.toString.call(obj).substr(-7) == 'Object]'

  var funReplacer = (key, value) => typeof value == 'function' ? '' + value : value

  utils.toJson = obj => JSON.stringify(obj, funReplacer)

  utils.isEmpty = obj => {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) return 0
    }
    return 1
  }

  utils.isHTMLEle = (item) => item && item.nodeType === 1

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

  //rAF:
  var queue = [],
    scheduled = [],
    prev = [];

  utils.scheduleFlush = function(id, fun) {
    return new Promise(function(resolve) {
      if (mag.rafBounce || mag.rafBounceIds[id] && fun) {
        if (scheduled[id]) {
          prev[id]()
          cancelAnimationFrame(scheduled[id]);
        }
        prev[id] = resolve
        scheduled[id] = requestAnimationFrame(start => {
          scheduled[id] = 0
          fun();
          resolve();
        })
      } else {
        if (fun) queue.push(fun);
        requestAnimationFrame(start=>processTaskList(resolve, start, id));
      }
    })
  }

  function processTaskList(resolve, taskStartTime, id) {
    var taskFinishTime;

    do {
      // Assume the next task is pushed onto a stack.
      var nextTask = queue.shift();

      // Process nextTask.
      if(nextTask)nextTask()

      // Go again if there’s enough time to do the next task.
      taskFinishTime = window.performance.now();
    } while (queue.length && taskFinishTime - taskStartTime < 16 );

    if (queue.length){
       utils.scheduleFlush(id)
                .then(() => resolve())
    } else {
      resolve()
    }

  }


  //Events:
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
    var instance = mag.mod.getMod(index);

    var obj = instance[eventName] ? instance : controller[eventName] && controller;
    if (obj) {
      isPrevented = obj[eventName].call(instance, node, props, index, extra)
      if (once) obj[eventName] = 0
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

  //Collection:
  var a = {
    i: [],
    isItem: id => ~a.i.indexOf(id),
    setItem: id => a.i[a.i.length] = id,
    getItem: id => a.i.indexOf(id),
    getItemVal: index => a.i[index],
    removeItem: id => a.i.splice(a.i.indexOf(id), 1)
  }

  utils.items = a

  utils.getItemInstanceIdAll = () => a.i

  utils.getItemInstanceId = id => {
    if (a.isItem(id)) {
      return a.getItem(id)
    } else {
      a.setItem(id)
      return a.getItem(id)
    }
  }


  mag.utils = utils

}(mag));
