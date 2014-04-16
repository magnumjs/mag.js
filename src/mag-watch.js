/**
 * @name mag-watch.js two way ui binding for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */

// https://gist.github.com/eligrey/384583
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "__watch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function(prop, handler) {
      var
      oldval = this[prop],
        newval = oldval,
        getter = function() {
          var that = this;
          //   handler.call(that, prop, oldval);
          return newval;
        }, setter = function(val) {
          oldval = newval;
          var that = this;
          handler.call(that, prop, oldval, val);
          return newval;
        };

      if (delete this[prop]) { // can't watch constants
        if (Object.defineProperty) // ECMAScript 5
          Object.defineProperty(this, prop, {
            get: getter,
            set: setter
          });
        else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
          Object.prototype.__defineGetter__.call(this, prop, getter);
          Object.prototype.__defineSetter__.call(this, prop, setter);
        }
      }
    }
  });
};

'use strict';
(function(magnum, undefined) {

  mag.watch.throttle = function(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
      deferTimer;
    return function() {
      var context = scope || this;

      var now = +new Date,
        args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };

  mag.watch.serve = function(name) {
    var rootScope = this;
    this.getScope(name);
    var ignoreKey = '__requires'; //defined in mag.reserved
    this.controls.__watch(name, mag.watch.throttle(function(property, oldValue, newValue) {
      // if empty or only ignoreKey present
      //TODO: don't check for value of keys, might be populated or diff.
      if ((JSON.stringify(oldValue) === JSON.stringify({})) || (JSON.stringify(oldValue) === JSON.stringify({
        ignoreKey: undefined
      }))) return;

      rootScope.fire('propertyChanged', [property, oldValue, newValue]);
    }, 250, rootScope));
  };

  mag.aspect.add('before', 'control', mag.watch.serve);

})(window.mag = window.mag || {}, mag.watch = {});
