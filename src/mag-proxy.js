/*
MagJS v0.22.8
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, global) {

  function proxyAssign(obj, cb) {
    var last = [];

    return new Proxy(obj, {
      get: function(proxy, name, receiver) {
        var retval = proxy[name],
          val = cb({
            type: 'get',
            object: mag.utils.copy(proxy[name]),
            name: name,
            oldValue: last[name]
          })
        if (typeof val != 'undefined') retval =proxy[name]=val;
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
        if (JSON.stringify(value) !== JSON.stringify(proxy[name])) {
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

  function observer(obj, cb) {
    //TODO: too expensive maybe on small objects?

    for (var k in obj) {
      if (Array.isArray(obj[k]) && obj[k].length < 101) {
        // assign
        obj[k] = proxyAssign(obj[k], cb)
      }
    }

    return proxyAssign(obj, cb)
  }

  mag.proxy = function(obj, callback) {
    if (obj && global.Proxy) {

      var handler = function(change) {

        if (typeof change.object[change.name] == 'object') {
          change.object[change.name] = mag.proxy(change.object[change.name], callback);
        }

        return callback(change);
      };

      return observer(obj, handler);
    }
  }

}(window.mag || {}, window));
