//////////////////////////////////
//MagJS
//////////////////////////////////
/**!
 * @name mag.js - Copyright (c) 2013 Michael Glazer
 * @description MagnumJS core code library
 * @requires - jQuery http://www.jquery.com
 * @author Michael Glazer
 * @date August 18, 2013
 * @version 0.1 - Alpha
 * @license MIT https://github.com/magnumjs/mag.js/blob/master/LICENSE
 * @link https://github.com/magnumjs
 */
;
'use strict';
(function ($, namespace, undefined) {


})(jQuery, window.mag = window.mag || {});



mag.aspect = {
    injectors: [],
    namespace: null,
    add: function (type, name, fun) {
        mag.aspect.injectors.push({
            type: type,
            name: name,
            fun: fun
        });
    },
    attach: function () {
        for (var i in mag.aspect.injectors) {
            var inject = mag.aspect.injectors[i];
            if (mag.aspect[inject.type]) {
                mag.aspect[inject.type](inject.name, inject.fun);
            }
        }
    },
    around: function (pointcut, advice) {

        var ns = mag.aspect.namespace;
        for (var member in mag.aspect.namespace) {

            if (typeof ns[member] == 'function' && member.match(pointcut)) {

                (function (fn, fnName, ns) {

                    ns[fnName] = function () {
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
    before: function (pointcut, advice) {
        mag.aspect.around(pointcut,
            function (f) {
                advice.apply(mag.aspect.namespace, f.arguments);
                return mag.aspect.next(f)
            });
    },
    after: function (pointcut, advice) {
        mag.aspect.around(pointcut,
            function (f) {
                var ret = mag.aspect.next(f);
                advice.apply(mag.aspect.namespace, f.arguments);
                return ret;
            });
    },
    next: function (f) {
        return f.fn.apply(mag.aspect.namespace, f.arguments);
    }
};

mag.inject = function (ns) {
    mag.aspect.namespace = ns;
    mag.aspect.attach();
}
mag.module = function (name) {
    var Injector = {
        dependencies: {},
        waiting: [],
        process: function (target, sargs) {

            var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
            var FN_ARG_SPLIT = /,/;
            var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            var text = target.toString().replace(STRIP_COMMENTS, '');
            var argDecl = text.match(FN_ARGS);
            var args = argDecl[1].split(FN_ARG_SPLIT).map(
                function (arg) {
                    return arg.trim()
                });

            var these = sargs || args;
            if (this.isRegistered(these)) {
                target.apply(target, this.getDependencies(these));
            } else {
                //wait for notice
                var waiter = {
                    target: target,
                    args: these
                };
                this.waiting.push(waiter);
            }
        },
        isRegistered: function (args) {
            var registered = true;
            for (var i in args) {
                var name = args[i];
                if (!this.dependencies[name]) {
                    registered = false;
                    break;
                }
            }
            return registered;
        },
        getDependencies: function (arr) {
            var self = this;
            return arr.map(function (value) {
                if (self.dependencies[value]['__instance']) {
                    return new self.dependencies[value];
                }
                return self.dependencies[value];
            });
        },
        register: function (name, dependency, instance) {
            this.dependencies[name] = dependency;
           if(instance) this.dependencies[name]['__instance'] = instance;
            this.service();
        },
        service: function () {
            for (var i in this.waiting) {
                var waiter = this.waiting[i];
                if (this.isRegistered(waiter.args)) {
                    waiter.target.apply(waiter.target, this.getDependencies(waiter.args));
                    delete this.waiting[i];
                }
            }
        }
    };
    return new function () {

        this.name = name;
        this.service = function (name, fun) {
            this.services = this.services || {};
            this.services[name] = this.services[name] || fun;
            Injector.register(name, fun, 1);
        }
        this.factory = function (name, fun) {
            this.factories = this.factories || {};
            this.factories[name] = this.factories[name] || fun;
            Injector.register(name, this.factories[name]());
        }
        this.control = function (name, fun) {
            this.controls = this.controls || {};
            Injector.register('Scope', this.getScope(name));
            var args = null;
            if (typeof fun != 'function') {
                args = fun;
                mfun = args.pop();
                var fs = mfun.toString();
                var nf = fs.substring(fs.indexOf("{") + 1, fs.lastIndexOf("}"));

                fun = new Function(args.join(), nf);
            }
            this.fire('mag-preload', [name]);
            Injector.process(fun, args);
            this.fire('mag-postload', [name]);
        }
        this.getScope = function (name) {
            return this.controls[name] = this.controls[name] || {};
        }
        this.observers = {};
        this.on = function (eventNames, listener) {
            eventNames = eventNames.split(/\s+/);
            while (eventName = eventNames.shift()) {
                if (!this.observers[eventName]) this.observers[eventName] = [];
                this.observers[eventName].push(listener);
            }
        }
        this.fire = function (eventName, args) {
            if (this.observers[eventName]) {
                for (var i = 0; i < this.observers[eventName].length; i++) {
                    this.observers[eventName][i].apply(this, args);
                }
            }
        }
        mag.inject(this);
    }

}

/*
  
var app = mag.module('myApp');

// singleton object instance "new"
app.service('Api',function(){
  this.getProjects = function(){  
    return new Object({first:'Mike',last:'Glazer'});
  }
});


app.control('myCtrl',function(Scope){
  Scope.test='Yo';
});
app.control('myCtrl',function(Scope){
  console.log(Scope);
});
*/
