/*
Mag.JS AddOns v0.21
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/

var mag = mag || {}

// helper
mag.noop = function(){}


/*
module library creation with single global namespace / package names
(function(namespace) {

  var mod = {
    controller:function(props){
    },
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

mag.show = function(context, conditionName) {
  if (typeof context !== 'object') {
    var obj = {
      _config: function(node) {
        node.style.display = context ? 'block' : 'none'
      }
    }
    if (typeof conditionName == 'object') {
      mag.merge(conditionName, obj)
    }
    return obj
  } else {
    context.willupdate = function(event, node, inprops) {
      node.style.display = inprops[conditionName] ? 'block' : 'none'
    }
  }
}


mag.addons = {};



// return object of getter values
mag.addons.getProp = function(data) {
  var newData = {}
  Object.keys(data).forEach(function(k) {
    if (data[k].type == 'fun' && typeof data[k] == 'function') newData[k] = data[k]()
  })
  return newData
}

// show hide

// remove class hide to given context/this
// show(this) inside controller
mag.addons.show = function(condition) {
  if (typeof condition === 'boolean') {
    return {
      _config: function(n) {
        if (!condition) n.style.display = 'none';
        else n.style.display = 'block';
      }
    };
  } else if (typeof condition === 'object') {
    condition.willload = function(e, n) {
      n.style.display = 'block'
    }
  } else if (arguments.length == 0) {
    return function(e, n) {
      // next didupdate event
      n.style.display = 'block'
    }
  }
}

mag.addons.hide = function(condition) {
  if (typeof condition === 'boolean') {
    return {
      _config: function(n) {
        if (condition) n.style.display = 'none';
        else n.style.display = 'block';
      }
    }
  } else if (typeof condition === 'object') {
    condition.willload = function(e, n) {
      n.style.display = 'none';
    }
  } else if (arguments.length == 0) {
    return function(e, n) {
      // next didupdate event
      n.style.display = 'none'
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

mag.addons.when = function(arrayOfPromises, callback) {
  Promise.all(arrayOfPromises).then(callback)
}

mag.addons.requestWithFeedback = function(args) {
  var key = JSON.stringify(args)
  if (!mag.addons.requestWithFeedback.cache[key]) {

    var loaders = document.querySelectorAll(".loader")

    //show icons
    for (var i = 0, loader; loader = loaders[i]; i++) loader.style.display = "block"

    var expire = function(data) {
      delete mag.addons.requestWithFeedback.cache[key]

      if (Object.keys(mag.addons.requestWithFeedback.cache).length == 0) {
        //hide icons
        for (var i = 0, loader; loader = loaders[i]; i++) loader.style.display = "none"
      }
      return data
    }
    mag.addons.requestWithFeedback.cache[key] = mag.request(args).then(expire, function(error) {
      expire(error)
      throw error
    })
  }
  return mag.addons.requestWithFeedback.cache[key]
}
mag.addons.requestWithFeedback.cache = {}


// hookins

mag.hookin('attributes', 'key', function(data) {
  // remove system key from being added to attributes in html
  //  data.value = null
})

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



// disable add to config
// http://jsbin.com/qutudiqife/3/edit?js,output
// define condition func
// this.show = mag.prop(false);

//define context
// mag.addons.disable.call(this, 'other', this.show);
//TODO: change to mag.ui.disable
mag.addons.disable = function(selector, condition) {

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
mag.addons.get = function(parentRootId, selector) {
  var parent = document.getElementById(parentRootId);
  return mag.fill.find(parent, selector)
}

// mag.addons.toMenu(['one', 'two', 'three'], state.selected())
// http://jsbin.com/mapuwojumu/3/edit?js,output
//TODO change to mag.ui.menu
mag.addons.toMenu = function(maps, selected) {
  return maps.map(function(v, k) {
    return {
      _text: v,
      _value: k,
      _selected: selected === k || selected === v ? true : null
    }
  })
}


/** DEPRECATED - ON THEIR WAY OUT!! **/

mag.prop=function(t){var n=function(){return arguments.length&&(t=arguments[0]),t};return n.toJSON=function(){return t},n.type="fun",n},mag.withProp=function(t,n){return function(r){r=r||event;var e=r.currentTarget||this;n(t in e?e[t]:e.getAttribute(t))}};
