/*
Mag.JS AddOns v0.23.5
(c) Michael Glazer 2017
https://github.com/magnumjs/mag.js
Requires: MagJS (core) Addons: Ajax , Router
*/
;
(function(mag, window, document, undefined) {

  'use strict';

  //Create wrapper for function call to mag.module with over riding default props	
  mag.create = function(id, module, props) {
    return function(id2, props2) {
      if (typeof id2 !== 'string' && !mag.utils.isHTMLEle(id2)) {
        props2 = id2
        id2 = 0
      }
      return mag.module(id2 || id, module, mag.merge(mag.copy(props) || {}, mag.copy(props2) || {}))
    }
  }

  mag.template = function(url, cb) {
    var req = url;
    
    //cache for prod?
    if(mag.ENV == 'prod'){
      req = {url: url, cache: 1}
    }  
    return mag.request(req)
      .then(function(data) {
      
        var dom = mag.html2dom(data);
      
        cb && cb(dom)

        return dom;
      })
  }

  mag.html2dom = function(htmlString){
    var template = mag.doc.createElement('template');
    template.innerHTML = htmlString;
    return template.content.children[0];
  }
  
  mag.getTags = function(tagName) {
    var parentID = mag.utils.items.getItemVal(mag.mod.runningViewInstance);
    var parentNode = mag.getNode(parentID);
    var nodes = (parentNode || mag.doc).getElementsByTagName(tagName);

    var elements = [].slice.call(nodes);
    return elements;
  }

  //wrapper around mag.module|mag.create for getting node(s) by tagName
  mag.tag = function(tagName, module, props, type) {
    var elements = mag.getTags(tagName);
    var instances = [];
    type = type || 'module' // create?

    if (elements.length) {
      for (var node of elements) {
        instances.push(mag[type](node, module, props));
      } 
    }
    return instances.length == 1 ? instances[0] : instances;
  }

  //UTILITY
  // mag.utils.copy - now in core
  // mag.utils.merge - now in core

  // helper
  mag.noop = function() {}
  mag.copy = mag.utils.copy
  mag.merge = mag.utils.merge

  mag.isEmpty = function(x) {
    // undefined, '', null, 0, empty array
    if (!x || 0 == x.length) return true
      // empty {}
    if ('Object]' == x.toString().substr(-7)) {
      for (var n in x)
        if (x.hasOwnProperty(n)) return false
      return true
    }
    //TODO:? convert to string and match single non-space character
    return x.trim()
  };

  /*
controller:function(props)
	// if props has a property 'isVisible' when true will display entire module on before updates
	mag.show(this,'isVisible')
}
http://jsbin.com/fegizubime/edit?html,js,output
*/

  // show hide

  mag.show = function(context, conditionName) {
    var ctype = typeof context;
    if (ctype !== 'object') {
      var obj = {
        _config: function(node) {
          node.style.display = context ? 'block' : 'none'
        }
      }
      if (typeof conditionName == 'object') {
        mag.merge(conditionName, obj)
      }
      return obj
    } else if (ctype == 'object') {
      context.willload = function(node, inprops) {
        node.style.display = 'block'
      }
    } else {
      context.willupdate = function(node, inprops) {
        node.style.display = inprops[conditionName] ? 'block' : 'none'
      }
    }
  }


  // promises

  /*
var d = mag.deferred()

d.promise.then(function() {
	console.log('success', arguments)
}, function() {
	console.log('failure', arguments)
})
d.reject({
	things: false
})
d.resolve({
	things: []
})
*/

  mag.deferred = function() {
    var Deferred = {}
    Deferred.promise = new Promise(function(resolve, reject) {
      Deferred.resolve = resolve
      Deferred.reject = reject
    })
    return Deferred
  }

  mag.when = function(arrayOfPromises, callback) {
    return Promise.all(arrayOfPromises).then(callback)
  }

  //TODO: add jsonp support

  mag.request = function(options) {
    if (typeof options == 'string') {
      var url = options;
      options = {}
      options.url = url;
    }
    var deferred = mag.deferred();
    if (options.initialValue) {
      deferred.promise.initialValue = options.initialValue
    }
    //Uid:
    var key = JSON.stringify(options)
      //Cache:
    if (options.cache) {
      var cache = mag.cache(key)
      if (cache) {
        deferred.resolve(cache)
        return deferred.promise
      }
    }

    //In queue:
    if (mag.request.queue[key]) {
      return mag.request.queue[key]
    }
    //Add to queue
    mag.request.queue[key] = deferred.promise;


    var client = new XMLHttpRequest();
    var method = (options.method || 'GET').toUpperCase();
    var data = method === "GET" || !options.data ? "" : typeof options.data === 'object' ? JSON.stringify(options.data) : options.data

    client.onload = function(e) {
      var ct = client.getResponseHeader("content-type") || "";
      var data = e.target.responseText;
      if (ct.indexOf('json') > -1) {
        data = JSON.parse(data)
      }
      if (options.cache) {
        mag.cache(key, data, options.cacheTime, options.cacheType)
      }
      delete mag.request.queue[key];
      var headers = client.getAllResponseHeaders();
      deferred.resolve(data, headers);
    }

    client.onerror = function(e) {
      deferred.reject(e)
    };

    client.open(method, options.url);
    if (options.withCredentials) client.withCredentials = options.withCredentials

    //Headers:
    if (options.headers) {
      for (var i = 0; i < options.headers.length; i++) {
        var header = options.headers[i]
        for (var k in header) {
          client.setRequestHeader(k, header[k]);
        }
      }
    }
    client.send(data);

    return deferred.promise
  }
  mag.request.queue = {}

  mag.cache = function(key, data, cacheTime, storageType) {
    var stype = window[storageType || 'sessionStorage']

    if (arguments.length == 1) {

      if (mag.cache.data[key]) {
        return mag.cache.data[key].data;
      } else {
        // check storage
        var item = stype.getItem(key)
        if (item) {
          mag.cache.data[key] = JSON.parse(item)
          return mag.cache.data[key].data
        } else return 0;
      }
    }

    if (mag.cache.data[key] && mag.cache.data[key].id) clearTimeout(mag.cache.data[key].id)

    var intervalID = setTimeout(function(key) {
      stype.removeItem(key);
      delete mag.cache.data[key]
    }.bind({}, key), cacheTime || 1000 * 60 * 10); //10 minutes

    mag.cache.data[key] = {
      id: intervalID,
      data: data
    }

    stype.setItem(key, JSON.stringify(mag.cache.data[key]))
  }
  mag.cache.data = {}

  // goes with mag.request for json ajax requests
  /*
will show and hide all ''.loader' elements in transition
*/
  mag.requestWithFeedback = function(args) {
    var key = JSON.stringify(args)
    if (!mag.requestWithFeedback.cache[key]) {

      var loaders = document.querySelectorAll(".loader")

      //show icons
      for (var i = 0, loader; loader = loaders[i]; i++) loader.style.display = "block"

      var expire = function(data) {
        delete mag.requestWithFeedback.cache[key]

        if (Object.keys(mag.requestWithFeedback.cache).length == 0) {
          //hide icons
          for (var i = 0, loader; loader = loaders[i]; i++) loader.style.display = "none"
        }
        return data
      }
      mag.requestWithFeedback.cache[key] = mag.request(args)
      mag.requestWithFeedback.cache[key].then(expire, function(error) {
        expire(error)
        throw error
      })
    }
    return mag.requestWithFeedback.cache[key]
  }
  mag.requestWithFeedback.cache = {}



  // disable add to config
  // http://jsbin.com/zepacabile/edit?js,output
  // define condition func
  // this.show = mag.prop(false);

  //define context
  //   this.input = mag.disable(this.show)
  // OR mag.disable(this.show, this.input={})
  //TODO: change to mag.ui.disable
  mag.disable = function(condition, obj) {

    // add or merge to config if not exists
    var orig = obj && obj._config ? obj._config : function() {};

    var tmp = {
      _config: function(n) {
        orig.apply(this, arguments);
        if (condition()) n.setAttribute('disabled', 'disabled');
        else n.removeAttribute('disabled');
      }
    }
    if (obj) {
      mag.merge(obj, tmp);
    }
    return tmp;

  }


  // TODO: change to mag.find
  // find a MagJS element Matcher
  mag.find = function(parentRootId, selector) {
    var parent = document.getElementById(parentRootId);
    return mag.fill.find(parent, selector)
  }

  // mag.addons.toMenu(['one', 'two', 'three'], state.selected())
  // http://jsbin.com/mapuwojumu/3/edit?js,output
  //TODO change to mag.ui.menu
  mag.toMenu = function(maps, selected) {
    return maps.map(function(v, k) {
      return {
        _text: v,
        _value: k,
        _selected: selected === k || selected === v ? true : null
      }
    })
  }

  /*
module library creation with single global namespace / package names
(function(namespace) {

	var mod = {
		view: function(state, props) {
		}
	}

	namespace.CommentBox = mod;

})(mag.namespace('mglazer.mods.comments'));
*/
  mag.namespace = function(ns, obj) {
    var levels = ns.split('.'),
      first = levels.shift();
    obj = obj || this; //if no object argument supplied declare a global property
    obj[first] = obj[first] || {}; // initialize the "level"
    if (levels.length) { // recursion condition
      return mag.namespace(levels.join('.'), obj[first]);
    }
    return obj[first]; // return a reference to the top level object
  }


  //ROUTER:


  mag.route = (function(window) {

    'use strict';

    var routes = [];

    function addRoute(route, handler) {

      routes.push({
        parts: route.split('/'),
        handler: handler
      });
    }

    function load(route) {
      window.location.hash = route;
    }

    function start() {

      var path = window.location.hash.substr(1),
        parts = path.split('/'),
        partsLength = parts.length;

      for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        if (route.parts.length === partsLength) {
          var params = [];
          for (var j = 0; j < partsLength; j++) {
            if (route.parts[j].substr(0, 1) === ':') {
              params.push(parts[j]);
            } else if (route.parts[j] !== parts[j]) {
              break;
            }
          }
          if (j === partsLength) {
            route.handler.apply(undefined, params);
            return;
          }
        }
      }
    }

    window.onhashchange = start;

    return {
      addRoute: addRoute,
      load: load,
      start: start
    };

  }(window));


  //PLUGINS!
  // hookins

  function forEach(obj, fn) {
    var keys = Object.keys(obj);
    for (var i = 0, l = keys.length; i < l; ++i) {
      var key = keys[i];
      fn(key, obj[key]);
    }
  }


  mag.hookin('attributes', 'key', function(data) {
    // remove system key from being added to attributes in html
    data.value = null
  });

  function camelDash(val) {
    return val.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  var unitlessProps = {
    opacity: 1,
    zIndex: 1,
    float: 1,
    fontWeight: 1,
    gridColumn: 1,
    lineHeight: 1,
    transform: 1,
    zoom: 1
  }

  mag.hookin('attributes', 'style', function(data) {

    //convert from object
    if (typeof data.value === 'object') {
      // get current styles not overwrite existing?
      var ostyle = data.node.getAttribute('style') || '';

      // make sure not already in styles
      var nstyle = ''
      forEach(data.value, function(key, value) {
        nstyle += camelDash(key) + ':' + (!isNaN(value) && !(key in unitlessProps) ? (value + "px") : value) + ';';
      });

      if (ostyle && ~ostyle.indexOf(nstyle)) data.value = ostyle;
      else data.value = ostyle + nstyle;
    }
  });

  // _className plugin example
  mag.hookin('attributes', 'className', function(data) {
    data.key = 'class';

    var newClass = data.value
    var origClass = data.node.classList + ''

    if (typeof data.value == 'string') {
      newClass = data.value.split(' ')
    } else if (typeof data.value == 'object') {
      for (var k in newClass) {
        data.node.classList.toggle(k, typeof newClass[k] !== 'undefined' && newClass[k])
      }
      data.value = data.node.classList + ''
      return
    }

    data.value = data.node.classList + ''

    for (var k in newClass) {
      var cls = newClass[k]
      if (cls.trim() && data.node.classList.length > 0 && !data.node.classList.contains(cls.trim())) {
        data.value = data.node.classList + ' ' + cls

      } else if (cls.trim() && data.node.classList.length == 0) {
        data.value += cls + ' '
      }
    }

    if (data.value.trim() !== origClass) {
      data.change = 1;
    }
    data.value = data.value.trim()
  })

  var queue = [];
  //Values hookin:
  mag.hookin('values', '*', function(data) {
    var dtype = typeof data.value

    if (data.value == null) {

    } else
    // allow function to return values
    if (dtype === 'function' && data.value.toJSON) {
      data.change = 1
      data.value = data.value()
    } else
    // Allow for promises to be resolved
    if (dtype == 'object' && typeof data.value.then == 'function') {
      if (!queue[mag.fill.id + data.key]) {
        queue[mag.fill.id + data.key] = 1;
        data.value.then(function(fillId, dataKey, newData) {
          if (fillId) {
            var mid = mag.utils.items.getItem(fillId);

            if (~mid) {
              mag.mod.getState(mid)[dataKey] = newData;
              mag.redraw(mag.getNode(fillId), mid);
              queue[fillId + data.key] = 0;
            }
          }
          return newData;
        }.bind(null, mag.fill.id, data.key));
      }
      if (data.value.initialValue) {
        data.change = 1;
        data.value = data.value.initialValue;
      }
    }
  });



  //GetId helper method
  mag.getId = function(instanceId) {
    return mag.utils.items.getItemVal(instanceId);
  };


  mag.prop = function(store) {
    var prop = function() {
      if (arguments.length) store = arguments[0];
      return store;
    };

    prop.toJSON = function() {
      return store;
    };

    return prop;
  };

  mag.withProp = function(prop, withAttrCallback) {
    return function(e) {
      e = e || event;
      var currentTarget = e.currentTarget || this;
      withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
    }
  }

})(mag, window || global || this, document);
