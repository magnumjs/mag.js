/*
MagJS v0.26.7
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, global) {

  var pathSeparator = '/';
  function proxyAssign(obj, cb, type, path) {
    var proxies = new WeakSet();

    function isProxy(obj) {
      return proxies.has(obj);
    }
    return new Proxy(obj, {
      get: function(proxy, name, receiver) {
        var retval = proxy[name];

        if (typeof name == 'symbol') return retval;

        //check for sub objects
        if (typeof retval === 'object' && typeof retval !== 'symbol' && retval !== null && typeof retval !== 'function' && !Array.isArray(retval) && mag.utils.isObject(retval) && !retval.then && !retval.draw) {

          if (!isProxy(retval)) {
            proxies.add(retval);
            return mag.proxy(retval, cb, type, path + pathSeparator + name);

          }
        } else if (!(name in proxy) && !~mag.fill.ignorekeys.indexOf(name.toString()) && !type && name[0] != '_') {
          retval = mag.proxy({}, cb, type, path + pathSeparator + name);
        }

        var val = cb({
          type: 'get',
          object: proxy,
          name: name,
          path: path,
          oldValue: Reflect.get(proxy, name, receiver)
        })
        if (typeof val != 'undefined') {
          //special case where node is found but no children or value given
          retval = val == mag.MAGNUM ? undefined : val;
        }

        return retval;
      },
      deleteProperty: function(proxy, name) {
        cb({
          type: 'delete',
          name: name,
          object: proxy,
          oldValue: Reflect.get(proxy, name)
        })
        return Reflect.deleteProperty(proxy, name);
      },
      set: function(proxy, name, value, receiver) {
        var oldVal = Reflect.get(proxy, name, receiver);
        //prevent recursion?
        if (oldVal === value && name !== 'length') return true;

        cb({
          type: 'set',
          name: name,
          object: proxy,
          oldValue: oldVal
        });

        return Reflect.set(proxy, name, value, receiver);
      }
    });

  }

  mag.proxy = function(obj, cb, type, path) {
    //TODO: too expensive maybe on small objects?

    for (var k in obj) {
      var stype = typeof obj[k];
      if (Array.isArray(obj[k]) && obj[k].length < 101) {
        // assign
        obj[k] = proxyAssign(obj[k], cb)
      } else if (stype == 'object' && obj[k] !== null && typeof k != 'symbol' && stype != 'symbol' && stype != 'function' && mag.utils.isObject(obj[k])) {
        obj[k] = mag.proxy(obj[k], cb, type, path + pathSeparator + k);
      }
    }

    return proxyAssign(obj, cb, type, path || pathSeparator)
  }

}(mag, window || global || this));
