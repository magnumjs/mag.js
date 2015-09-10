/*
Mag.JS ajax v0.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/

var mag = mag || {}

var Deferred = function() {
  return function Deferred(resolve, reject) {
    Deferred.resolve = resolve
    Deferred.reject = reject
  }
}
var FUNCTION = 'function'
var STRING = '[object String]';

var  $document = document

function identity(value) {
  return value
}

var type = {}.toString
var ARRAY = '[object Array]'
var OBJECT = '[object Object]'


function ajax(options) {
  if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
    var callbackKey = "magnum_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
    var script = $document.createElement("script");

    window[callbackKey] = function(resp) {
      script.parentNode.removeChild(script);
      options.onload({
        type: "load",
        target: {
          responseText: resp
        }
      });
      window[callbackKey] = undefined
    };

    script.onerror = function(e) {
      script.parentNode.removeChild(script);

      options.onerror({
        type: "error",
        target: {
          status: 500,
          responseText: JSON.stringify({
            error: "Error making jsonp request"
          })
        }
      });
      window[callbackKey] = undefined;

      return false
    };

    script.onload = function(e) {
      return false
    };

    script.src = options.url + (options.url.indexOf("?") > 0 ? "&" : "?") + (options.callbackKey ? options.callbackKey : "callback") + "=" + callbackKey + "&" + buildQueryString(options.data || {});
    $document.body.appendChild(script)
  } else {
    var xhr = new window.XMLHttpRequest;
    xhr.open(options.method, options.url, true, options.user, options.password);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) options.onload({
          type: "load",
          target: xhr
        });
        else options.onerror({
          type: "error",
          target: xhr
        })
      }
    };
    if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
      xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
    }
    if (options.deserialize === JSON.parse) {
      xhr.setRequestHeader("Accept", "application/json, text/*");
    }
    if (typeof options.config === FUNCTION) {
      var maybeXhr = options.config(xhr, options);
      if (maybeXhr != null) xhr = maybeXhr
    }

    var data = options.method === "GET" || !options.data ? "" : options.data
    if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
      throw "Request data should be either be a string or FormData. Check the `serialize` option in `mag.request`";
    }
    xhr.send(data);
    return xhr
  }
}

function bindData(xhrOptions, data, serialize) {
  if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
    var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
    var querystring = buildQueryString(data);
    xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
  } else xhrOptions.data = serialize(data);
  return xhrOptions
}

function parameterizeUrl(url, data) {
  var tokens = url.match(/:[a-z]\w+/gi);
  if (tokens && data) {
    for (var i = 0; i < tokens.length; i++) {
      var key = tokens[i].slice(1);
      url = url.replace(tokens[i], data[key]);
      delete data[key]
    }
  }
  return url
}

mag.request = function(xhrOptions) {
  var deferred = new Deferred();
  var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
  var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
  var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
  var extract = isJSONP ? function(jsonp) {
    return jsonp.responseText
  } : xhrOptions.extract || function(xhr) {
    return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
  };
  xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
  xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
  xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
  xhrOptions.onload = xhrOptions.onerror = function(e) {
    try {
      e = e || event;
      var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
      //console.log(e.target)
      var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
      if (e.type === "load") {
        if (type.call(response) === ARRAY && xhrOptions.type) {
          for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
        } else if (xhrOptions.type) response = new xhrOptions.type(response)
      }
      deferred[e.type === "load" ? "resolve" : "reject"](response)
    } catch (e) {
      deferred.reject(e)
    }
  };
  ajax(xhrOptions);
  //		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);

  var promise = new Promise(deferred)
  return promise
};

function buildQueryString(object, prefix) {
  var duplicates = {}
  var str = []
  for (var prop in object) {
    var key = prefix ? prefix + "[" + prop + "]" : prop
    var value = object[prop]
    var valueType = type.call(value)
    var pair = (value === null) ? encodeURIComponent(key) :
      valueType === OBJECT ? buildQueryString(value, key) :
      valueType === ARRAY ? value.reduce(function(memo, item) {
        if (!duplicates[key]) duplicates[key] = {}
        if (!duplicates[key][item]) {
          duplicates[key][item] = true
          return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
        }
        return memo
      }, []).join("&") :
      encodeURIComponent(key) + "=" + encodeURIComponent(value)
    if (value !== undefined) str.push(pair)
  }
  return str.join("&")
}

function parseQueryString(str) {
  if (str.charAt(0) === "?") str = str.substring(1);

  var pairs = str.split("&"),
    params = {};
  for (var i = 0, len = pairs.length; i < len; i++) {
    var pair = pairs[i].split("=");
    var key = decodeURIComponent(pair[0])
    var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
    if (params[key] != null) {
      if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
      params[key].push(value)
    } else params[key] = value
  }
  return params
}

// mag.request({
//   url: 'https://api.github.com/users/defunkt'
// })
