/**
 * @name mag-inject.js dependency injection for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */
;
'use strict';
mag.inject = {
  namespace: undefined,
  dependencies: {},
  waiting: [],
  findArgs: function(target) {
    if (typeof target !== 'function') return;
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var text = target.toString().replace(STRIP_COMMENTS, '');
    var argDecl = text.match(FN_ARGS);
    var args = argDecl[1].split(FN_ARG_SPLIT).map(
      function(arg) {
        return arg.trim()
      });
    return args;
  },
  getInstance: function(instance) {
    this.instances = this.instances || {};
    this.instances[this.namespace] = this.instances[this.namespace] || {};
    if (this.instances[this.namespace][instance]) {
      return this.instances[this.namespace][instance];
    }
  },
  setInstance: function(instance, object) {
    this.instances[this.namespace][instance] = object;
  },
  process: function(target, sargs, instance, context, name) {
    var args = this.findArgs(target);
    var these = sargs || args;

    function construct(constructor, args, context) {
      function F() {
        return constructor.apply(context || this, args);
      }
      F.prototype = constructor.prototype;
      return new F();
    }
    if (instance) {
      //TODO: cache to maintain state for services, good idea?
      var object = this.getInstance(instance);
      if (object) return object;
      object = construct(target, this.getArrayDependencies(these));
      this.setInstance(instance, object);
      return object;
    }
    if (this.isRegistered(these)) {
      var promise = target.apply(context, this.getArrayDependencies(these));

      if (promise && promise.done) {
        promise.done(function() {
          (context.controls[name]);
        });
      }

    } else {
      //wait for notice
      var waiter = {
        target: target,
        args: these
      };
      this.waiting.push(waiter);
    }
  },
  isRegistered: function(args) {
    var registered = true;
    log('info', 'isRegistered args:', args);
    for (var i in args) {
      var name = args[i];
      if (!this.getDependencies()[name]) {
        log('info', 'Dependency not registered when called:', name);
        registered = false;
        break;
      }
    }
    return registered;
  },
  getArrayDependencies: function(arr) {
    var depends = this.getDependencies();
    // make sure dependencies requires are loaded
    var that = this;
    return arr.map(function(value) {
      // need to return promise/deferred objects
      if (depends[value] && depends[value]['__requires']) {
        log('info', 'this dependency has dependencies: ' + value);
        log('info', 'requires: ' + depends[value]['__requires']);
      }
      if (depends[value] && depends[value]['__instance']) {
        return that.process(depends[value], null, value);
        //return new depends[value];
      }
      return depends[value];
    });
  },
  getDependencies: function(namespace) {
    return this.dependencies[namespace || this.namespace] || {};
  },
  register: function(name, dependency, instance) {
    var depends = this.findArgs(dependency);
    log('info', name + ' requires ' + depends);
    this.getDependencies()[name] = dependency;
    if (instance) this.getDependencies()[name]['__instance'] = instance;
    this.getDependencies()[name]['__requires'] = depends;
    this.service();
  },
  service: function() {
    for (var i in this.waiting) {
      var waiter = this.waiting[i];
      if (waiter&&this.isRegistered(waiter.args)) {
        waiter.target.apply(waiter.target, this.getArrayDependencies(waiter.args));
        this.waiting[i]=undefined;
      }
    }
  }
};
