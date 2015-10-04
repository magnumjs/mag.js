/*
Mag.JS AddOns v0.12.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/

var mag = mag || {}

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


mag.addons = {};
// helper function for non proxy supported browser i.e. NOT firefox
// state.form = mag.addons.binds(state)
mag.addons.binds = function(data, attachTo, callback) {
  var oldVal, handler = function(e) {

    var val = e.target.type == 'checkbox' ? e.target.checked : e.target.value
    if (oldVal && val === oldVal) return
    
    mag.addons.addFocus(e.target)

    oldVal = val;

    var name = e.target.name
    if (data[name] && data[name].type == 'fun' && typeof data[name] == 'function') {
      data[name](val)
    } else if (name) {
      //necessary ?
      if (data[name] && typeof data[name]._text !== 'undefined')
        data[name]._text = val
      else
        data[name] = val
    }

    if (typeof Object.observe !== 'undefined') {
      Object.observe(data, function(changes) {
        // update target with changes
        changes.forEach(function(change) {
          if (change.type == 'update' || change.type == 'add') {
            // update the related dom
            if (e.target.name == change.name && e.target.value !== change.object[change.name])
              e.target.value = change.object[change.name]
          }
        })
      })
    }
    if (callback && typeof callback == 'function') callback()
  }
  var addThis = {}

  var events = ['_onchange', '_oninput']
  for (var k in events) addThis[events[k]] = handler

  addThis['_config'] = function(node, isNew) {

    for (var j in data) {
      var ele = document.querySelector('[name="' + j + '"]'),val =typeof data[j]=='function'?data[j](): 
      data[j]
      if (j && isNew && ele) {
       // ele.click()
      } else if (j && ele && ele.value !== val) {
        // checkboxes/select/textarea ?
        ele.value = val
      }
    }
  }
  if (attachTo) mag.addons.merge(addThis, attachTo)

  return addThis
}

mag.addons.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// needed for async change values such as change & bind
mag.addons.addFocus = function(ele) {
  mag.addons.debounce(function() {
    ele.focus()
  }, 15)()
}

// simple bind to keyup event
// mag.addons.change(state, state.form={})
// state.form = mag.addons.change(state)
mag.addons.change = function(data, addTo) {
  var src = {
    _onkeyup: function(e) {
      
      var val = e.target.type == 'checkbox' ? e.target.checked : e.target.value
      
      typeof data[e.target.name]=='function'?data[e.target.name](val):data[e.target.name]=val
      
      //data[e.target.name](e.target.value)
      mag.addons.addFocus(e.target)
    }
  }
  if (addTo) {
    return mag.addons.merge(src, addTo)
  }
  return src
}

// BINDS
// this is the context which should be the 'state'
//  mag.addons.bindEvent.call(state, 'input', 'keyup', props.model.name)

mag.addons.bindEvent = function(field, event, model) {
  var src = {}
  src._value = model()
  src['_on' + event] = mag.withProp('value', model)

  mag.addons.merge(src, this[field] = {});
}

// bind methods from a model to a controller instance
//  mag.addons.bindToModel(this, Todo)
mag.addons.bindToModel = function(context, model) {
  for (var meth in model) {
    context[meth] = model[meth].bind(context)
  }
}


//UTILITY
mag.addons.copy = function(o) {
  var out, v, key;
  out = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    out[key] = (typeof v === "object") ? mag.addons.copy(v) : typeof v == 'function' && v.type=='fun' ? mag.prop(v()) : v;
  }
  return out;
}

mag.addons.merge = function(source, destination) {
  for (var k in source) destination[k] = source[k]
  return destination;
}

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

// life cycle event helpers

mag.addons.onNextUpdate = function(context, callback) {
  context.didupdate = function(event, node) {
    return callback.call(context, event, node)
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

mag.addons.get = function(parentRootId, selector) {
  var parent = document.getElementById(parentRootId);
  return mag.fill.find(parent, selector)
}

// mag.addons.toMenu(['one', 'two', 'three'], state.selected())
// http://jsbin.com/mapuwojumu/3/edit?js,output
mag.addons.toMenu = function(maps, selected) {
  return maps.map(function(v, k) {
    return {
      _text: v,
      _value: k,
      _selected: selected === k || selected === v ? true : null
    }
  })
}

// when the async module loading is completed
// mag.addons.sync.call(state, messages, 'messages');
mag.addons.sync=function(promises, prop){
  if(Array.isArray(promises)){
      mag.addons.when(promises, function(data) {
      this[prop] = data;
      mag.redraw()
    }.bind(this))
  } else {
    promises.then(function(data){
      this[prop] = data;
      mag.redraw()
    }.bind(this))
  }
}
