//////////////////////////////////
//MagJS
//////////////////////////////////
/**!
 * @name mag.js - Copyright (c) 2013, 2014 Michael Glazer
 * @description MagnumJS core code library
 * @requires - jQuery http://www.jquery.com
 * @author Michael Glazer
 * @date 4/19/2014
 * @version Alpha - 0.2.25
 * @license MIT https://github.com/magnumjs/mag.js/blob/master/LICENSE
 * @link https://github.com/magnumjs
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
  mag.aspect = {
    injectors: [],
    namespace: null,
    add: function(type, name, fun) {
      mag.aspect.injectors.push({
        type: type,
        name: name,
        fun: fun
      });
    },
    attach: function() {
      for (var i in mag.aspect.injectors) {
        var inject = mag.aspect.injectors[i];
        if (mag.aspect[inject.type]) {
          mag.aspect[inject.type](inject.name, inject.fun);
        }
      }
    },
    around: function(pointcut, advice) {
      var ns = mag.aspect.namespace;
      for (var member in mag.aspect.namespace) {
        if (typeof ns[member] == 'function' && member.match(pointcut)) {
          (function(fn, fnName, ns) {
            ns[fnName] = function() {
              return advice.call(ns, {
                fn: fn,
                fnName: fnName,
                arguments: arguments
              });
            };
          })(ns[member], member, ns);
        }
      }
    },
    before: function(pointcut, advice) {
      mag.aspect.around(pointcut,
        function(f) {
          advice.apply(mag.aspect.namespace, f.arguments);
          return mag.aspect.next(f)
        });
    },
    after: function(pointcut, advice) {
      mag.aspect.around(pointcut,
        function(f) {
          var ret = mag.aspect.next(f);
          advice.apply(mag.aspect.namespace, f.arguments);
          return ret;
        });
    },
    next: function(f) {
      return f.fn.apply(mag.aspect.namespace, f.arguments);
    }
  };
  mag.inject = function(ns) {
    mag.aspect.namespace = ns;
    mag.aspect.attach();
  };
  mag.module = function(name, /* [] = create new override existing 'name' */ dependentModules) {
    log('info', 'module name:' + name);
    this.modules = this.modules || {};
    var instance = this.modules[name];
    //TODO: create new instance if second parameter is empty array
    if (instance && (!dependentModules || (dependentModules && dependentModules.length == 0))) {
      return instance;
    }
    var Injector = {
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
      process: function(target, sargs, instance) {
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
          target.apply(target, this.getArrayDependencies(these));
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
          if (this.isRegistered(waiter.args)) {
            waiter.target.apply(waiter.target, this.getArrayDependencies(waiter.args));
            delete this.waiting[i];
          }
        }
      }
    };
    Injector.namespace = name;
    Injector.dependencies[name] = {};
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
              Injector.register(skey, depend.services[skey], 1);
            }
            for (var fkey in depend.factories) {
              Injector.register(fkey, depend.factories[fkey]());
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
      this.config = function(fun) {
        Injector.process(fun);
      };
      this.service = function(name, fun) {
        this.services = this.services || {};
        this.services[name] = this.services[name] || fun;
        Injector.register(name, fun, 1);
      };
      this.factory = function(name, fun) {
        this.factories = this.factories || {};
        this.factories[name] = this.factories[name] || fun;
        Injector.register(name, this.factories[name]());
      }
      this.control = function(name, fun) {
        this.controls = this.controls || {};
        Injector.register('Scope', this.getScope(name));
        var ret = processArgs(fun);
        this.fire('mag.control.process.begin', [name]);
        Injector.process(ret[0], ret[1]);
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
      mag.inject(this);
    }
  }
})(window.mag = {});
