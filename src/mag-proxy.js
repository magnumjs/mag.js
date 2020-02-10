import {isObject, isArray, isFunction, isUndefined} from "./core/utils/common"
import {MAGNUM, ignorekeys} from './core/constants';

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
      if (
        isObject(retval) &&
        typeof retval !== 'symbol' &&
        retval !== null &&
        !isFunction(retval) &&
        !isArray(retval) &&
        isObject(retval) &&
        !retval.then &&
        !retval.draw
      ) {
        if (!isProxy(retval)) {
          proxies.add(retval);
          return proxy(retval, cb, type, path + pathSeparator + name);
        }
      } else if (
        !(name in proxy) &&
        !~ignorekeys.indexOf(name.toString()) &&
        !type &&
        name[0] != '_'
      ) {
        retval = proxy({}, cb, type, path + pathSeparator + name);
      }

      var val = cb({
        type: 'get',
        object: proxy,
        name: name,
        path: path,
        oldValue: Reflect.get(proxy, name, receiver)
      });
      if (!isUndefined(val)) {
        //special case where node is found but no children or value given
        retval = val == MAGNUM ? undefined : val;
      }

      return retval;
    },
    deleteProperty: function(proxy, name) {
      cb({
        type: 'delete',
        name: name,
        object: proxy,
        oldValue: Reflect.get(proxy, name)
      });
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

const proxy = function(obj, cb, type, path) {
  //TODO: too expensive maybe on small objects?

  for (var k in obj) {
    var stype = typeof obj[k];
    if (isArray(obj[k]) && obj[k].length < 101) {
      // assign
      obj[k] = proxyAssign(obj[k], cb);
    } else if (
      isObject(stype) &&
      obj[k] !== null &&
      typeof k != 'symbol' &&
      stype != 'symbol' &&
      !isFunction(stype) &&
      isObject(obj[k])
    ) {
      obj[k] = proxy(obj[k], cb, type, path + pathSeparator + k);
    }
  }

  return proxyAssign(obj, cb, type, path || pathSeparator);
};

export default proxy;
