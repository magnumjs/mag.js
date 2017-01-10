/*
MagJS v0.24.8
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, global) {

  function proxyAssign(obj, cb, type, path) {
    var last = [];
    var proxies = new WeakSet();

    function isProxy(obj) {
      return proxies.has(obj);
    }
    return new Proxy(obj, {
      get: function(proxy, name) {
        var retval = proxy[name];

        if (typeof name == 'symbol') return retval;


        //check for sub objects
        if (typeof retval === 'object' && typeof retval !== 'symbol' && retval !== null && typeof retval !== 'function' && !Array.isArray(retval) && retval.toString() == '[object Object]' && !retval.then && !retval.draw) {

          if (!isProxy(retval)) {
            proxies.add(retval);
            return mag.proxy(retval, cb, type, path + '/' + name);
          }
        } else if (!(name in proxy) && !~mag.fill.ignorekeys.indexOf(name.toString()) && !type) {
          //Not for properties!?
          retval = mag.proxy({}, cb, type, path + '/' + name);
        }

        var val = cb({
          type: 'get',
          object: mag.utils.copy(proxy),
          name: name,
          path: path,
          oldValue: last[name]
        })
        if (typeof val != 'undefined') retval = val;
        return retval;
      },
      deleteProperty: function(proxy, name) {
        cb({
          type: 'delete',
          name: name,
          object: proxy,
          oldValue: last[name]
        })
        return delete proxy[name]
      },
      set: function(proxy, name, value) {
        //prevent recursion?
        if (last[name] === value && name !== 'length') return true;
        if (name !== 'length' && JSON.stringify(value) !== JSON.stringify(proxy[name])) {
          last[name] = mag.utils.copy(proxy[name]);
        }

        cb({
          type: 'set',
          name: name,
          object: proxy,
          oldValue: last[name]
        });

        proxy[name] = value;
        return true;
      }
    });

  }

  function observer(obj, cb, type, path) {
    //TODO: too expensive maybe on small objects?

    for (var k in obj) {
      var stype = typeof obj[k];
      if (Array.isArray(obj[k]) && obj[k].length < 101) {
        // assign
        obj[k] = proxyAssign(obj[k], cb)
      } else if (stype == 'object' && obj[k] !== null && typeof k != 'symbol' && stype != 'symbol' && typeof k != 'symbol' && stype != 'function' && obj[k].toString() == '[object Object]') {
        obj[k] = mag.proxy(obj[k], cb, type, path + '/' + k);
      }
    }

    return proxyAssign(obj, cb, type, path || '/')
  }

  mag.proxy = function(obj, callback, type, path) {

    var handler = function(change) {
      return callback(change);
    };

    return observer(obj, handler, type, path);
  }

}(mag, window || global || this));
