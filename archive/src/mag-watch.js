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
    value: function (prop, sethandler, gethandler) {
      var
        oldval = this[prop],
        newval = oldval,
        getter = function () {
          newval = gethandler.call(this, prop, newval);
          return newval;
        }, setter = function (val) {
          sethandler.call(this, prop, oldval, val);
          return val;
        };
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
  });
}

'use strict';
(function (mag, watch, undefined) {

  mag.watch.throttle = function (fn, threshhold, scope) {
    threshhold || (threshhold = 200);
    var last,
      deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
        args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };
  var queue = {};
  queue.inQueue=function (obj) {
    this.q = this.q || [];
    if (this.q.indexOf(obj) !== -1) return true;
    else this.q.push(obj);
  }
  mag.watch.serve = function (name) {
    var rootScope = this;
    var scope = this.getScope(name);
    var ignoreKey = '__requires'; //defined in mag.reserved

    function isIgnored(oldValue, newValue, ignoreKey) {
      if (newValue === {} ||
        (JSON.stringify(oldValue) === JSON.stringify({})) || (JSON.stringify(oldValue) === JSON.stringify({
        ignoreKey: undefined
      }))) return true;
      return false;
    }

    var sethandler =
      //mag.watch.throttle(
      function (property, oldValue, newValue) {
        log('info', 'set-' + property, oldValue, newValue);

        // if empty or only ignoreKey present
        //TODO: don't check for value of keys, might be populated or diff.
        if (isIgnored(oldValue, newValue, ignoreKey)) return;
        //console.log(oldValue);

        log('info', property, oldValue, newValue);
        var promise = null;

        for (var k in newValue) {
          promise = newValue[k];
          if (promise && promise.done && !queue.inQueue(promise)) {
            promise.done(function (d) {
              rootScope.controls[name][k] = d;
              rootScope.fire('propertyChanged', [property, oldValue, newValue]);
            });
          }
        }
        if (!promise) {
          rootScope.fire('propertyChanged', [property, oldValue, newValue]);
        }
        return;
      }
    //);

    var gethandler =
      //mag.watch.throttle(
      function (prop, newval) {
        //console.log(prop, newval);
        log('info', 'get' + prop, newval);
        rootScope.fire('propertyAccessed', arguments);

        // check if newValue is a promise
        // if (typeof newValue.done === 'function') {
        // convert to wrapper
        // newValue.then(function(data) {
        //       Scope[property]  = data;
        // }

        // function isPromise(value) {
        //   if (typeof value.then !== "function") {
        //     return false;
        //   }
        //   var promiseThenSrc = String($.Deferred().then);
        //   var valueThenSrc = String(value.then);
        //   return promiseThenSrc === valueThenSrc;
        // }
        return newval;
      }
    //);

    this.controls.__watch(name, sethandler, gethandler);
    // watch dom changes
    // look in scope container
    // user input changes

    this.on('mag.render.end', function (name) {
      mag.watch.apply.call(this, scope, name);
    });
  };

  mag.watch.apply = function (scope, name) {

    var that = this;
    var ele = mag.domElement(mag.render.template);

    for (var key in scope) {
      var elements = ele.findElementsByKey(key);

      if (!elements) continue;

      for (var i = 0; i < elements.length; i++) {
        if (["INPUT", "TEXTAREA", 'SELECT'].indexOf(elements[i].tagName) !== -1) {
          var DOMelement = elements[i];
        }
      }
      if (!DOMelement) continue;

      var item = key;
      var call = function (e) {
        var val = e.srcElement.value;
        if (e.stopPropagation) e.stopPropagation();
        // support IE necessary?
        if (e.cancelBubble != null) e.cancelBubble = true;

        (function (item, val, context) {
          //console.log(item, val);
          context.controls[name][item] = val;
          context.fire('propertyChanged', [key, val, val]);
        }(item, val, that));

      }.bind(this);

      DOMelement._events = DOMelement._events || [];
      if (DOMelement._events.indexOf('bind-change') === -1) {
        DOMelement.addEventListener('change', mag.watch.throttle(call, 50), false);
        DOMelement.addEventListener('input', mag.watch.throttle(call, 50), false);
        DOMelement.addEventListener('propertyChange', mag.watch.throttle(call, 50), false);
        DOMelement._events.push('bind-change');
      }
    }
  };

  mag.aspect.add('before', 'control', mag.watch.serve);

})(window.mag = window.mag || {}, mag.watch = {});
