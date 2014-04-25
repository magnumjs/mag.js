/**
 * @name dom-aspect.js AOP cross-cutting advice for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */
;
'use strict';
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
mag.injection = function(ns) {
  mag.aspect.namespace = ns;
  mag.aspect.attach();
};
