//////////////////////////////////
//MagJS
//////////////////////////////////
/**!
 * @name mag.js - Copyright (c) 2013, 2014 Michael Glazer
 * @description MagnumJS core code library
 * @author Michael Glazer
 * @date 4/25/2014
 * @version Alpha - 0.2.32
 * @license MIT https://github.com/magnumjs/mag.js/blob/master/LICENSE
 * @link https://github.com/magnumjs/mag.js
 */
'use strict';
(function(mag, undefined) {
  var LOG_LEVEL = 'warn'; //info|warn|error|debug|log
  window.log = function() {
    var level = [].shift.apply(arguments);
    var args = Array.prototype.slice.call(arguments);
    if (level == LOG_LEVEL && console) console[LOG_LEVEL](args.join(','));
  };
  mag.reserved = ['__requires', '__instance'];

  mag.module = function(name, /* [] = create new override existing 'name' */ dependentModules) {
    log('info', 'module name:' + name);
    this.modules = this.modules || {};
    var instance = this.modules[name];
    //TODO: create new instance if second parameter is empty array
    // USE CASES; 1. module exists && no dependencies
    if (instance && ((!dependentModules) || (dependentModules && dependentModules.length != 0))) {
      return instance;
    }
    mag.inject.namespace = name;
    mag.inject.dependencies[name] = {};
    // load dependency modules first
    if (dependentModules) {
      var loadDependencies = function(dependentModules) {
        var depends = [];
        for (var index = 0, size = dependentModules.length; index < size; index++) {
          var dependent = dependentModules[index];
          if (this.modules[dependent]) {
            var depend = this.modules[dependent];
            depends.push(depend);
            //if dependency not yet defined give it to the waiter
            for (var skey in depend.services) {
              mag.inject.register(skey, depend.services[skey], 1);
            }
            for (var fkey in depend.factories) {
              mag.inject.register(fkey, depend.factories[fkey]());
            }
          }
        }
      }.bind(this);
      loadDependencies(dependentModules);
    }

    function processArgs(fun) {
      var args;
      if (typeof fun != 'function') {
        args = fun;
        var mfun = args.pop();
        var fs = mfun.toString();
        var nf = fs.substring(fs.indexOf("{") + 1, fs.lastIndexOf("}"));
        fun = new Function(args.join(), nf);
      }
      return [fun, args];
    }
    return this.modules[name] = new function() {
      this.name = name;
      this.directive = function(name, fun) {
        // https://docs.angularjs.org/guide/directive
        // register to the renderer?
        //       .directive('myCustomer', function() {
        //   return {
        //     template: 'Name: {{customer.name}} Address: {{customer.address}}'
        //   };
        // });
      };
      this.config = function(fun) {
        mag.inject.process(fun);
      };
      this.service = function(name, fun) {
        this.services = this.services || {};
        this.services[name] = this.services[name] || fun;
        mag.inject.register(name, fun, 1);
      };
      this.factory = function(name, fun) {
        this.factories = this.factories || {};
        this.factories[name] = this.factories[name] || fun;
        mag.inject.register(name, this.factories[name]());
      }
      this.control = function(name, fun) {
        this.controls = this.controls || {};
        mag.inject.register('Scope', this.getScope(name));
        var ret = processArgs(fun);
        this.fire('mag.control.process.begin', [name]);
        mag.inject.process(ret[0], ret[1], 0, this, name);
        this.fire('mag.control.process.end', [name]);
      }
      this.getScope = function(name) {
        this.controls = this.controls || {};
        return this.controls[name] = this.controls[name] || {};
      }
      this.observers = {};
      this.on = function(eventNames, listener) {
        eventNames = eventNames.split(/\s+/);
        var eventName;
        while (eventName = eventNames.shift()) {
          if (!this.observers[eventName]) this.observers[eventName] = [];
          this.observers[eventName].push(listener);
        }
      }
      this.fire = function(eventName, args) {
        if (this.observers[eventName]) {
          for (var i = 0; i < this.observers[eventName].length; i++) {
            this.observers[eventName][i].apply(this, args);
          }
        }
      }
      mag.injection(this);
    }
  }
})(window.mag = {});
