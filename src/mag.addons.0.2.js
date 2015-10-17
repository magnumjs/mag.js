/*
Mag.JS AddOns v0.21.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js
Requires: MagJS (core) Addons: Ajax , Router
*/

;(function(mag, window, document, undefined){
// helper
mag.noop = function(){}


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
mag.namespace = function (ns, obj) {
   var   levels = ns.split('.'), first = levels.shift();
  obj = obj || this; //if no object argument supplied declare a global property
  obj[first] = obj[first] || {}; // initialize the "level"
  if (levels.length) { // recursion condition
    return mag.namespace(levels.join('.'), obj[first]);
  }
  return obj[first]; // return a reference to the top level object
}


//UTILITY
// mag.utils.copy - now in core
// mag.utils.merge - now in core

mag.copy = mag.utils.copy 
mag.merge = mag.utils.merge

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
  } else if(ctype == 'object'){
    context.willload = function(event, node, inprops) {
      node.style.display = 'block'
    }    
  } else {
    context.willupdate = function(event, node, inprops) {
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
  Promise.all(arrayOfPromises).then(callback)
}

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
    mag.requestWithFeedback.cache[key] = mag.request(args).then(expire, function(error) {
      expire(error)
      throw error
    })
  }
  return mag.requestWithFeedback.cache[key]
}
mag.requestWithFeedback.cache = {}



// disable add to config
// http://jsbin.com/qutudiqife/3/edit?js,output
// define condition func
// this.show = mag.prop(false);

//define context
// mag.addons.disable.call(this, 'other', this.show);
//TODO: change to mag.ui.disable
mag.disable = function(selector, condition) {

  if (typeof this[selector] !== 'object') {
    // create object
    this[selector] = {
      _value: this[selector]
    };
  }

  // add or merge to config if not exists
  var orig = this[selector]._config ? this[selector]._config : function() {};

  this[selector]._config = function(n) {
    orig.call(this, arguments);
    if (condition()) n.setAttribute('disabled', 'disabled');
    else n.removeAttribute('disabled');
  };
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


//PLUGINS!
// hookins

mag.hookin('attributes', 'key', function(data) {
  // remove system key from being added to attributes in html
  //  data.value = null
})

// _className plugin example
mag.hookin('attributes', 'className', function(data) {
  data.key = 'class'
  var newClass = data.value
  
  if (typeof data.value == 'string') {
    newClass = data.value.split(' ')
  } else if(typeof data.value == 'object') {
    for (var k in newClass) {
      data.node.classList.toggle(k, newClass[k])
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

  data.value = data.value.trim()
})



  mag.prop = function(store) {
    var prop = function() {
      if (arguments.length) store = arguments[0];
      return store;
    };

    prop.toJSON = function() {
      return store;
    };
    prop.type = 'fun'
    return prop;
  };

  mag.withProp = function(prop, withAttrCallback) {
    return function(e) {
      e = e || event;
      var currentTarget = e.currentTarget || this;
      withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
    }
  }
	
})(mag, window, document);
