/*
Mag.JS AddOns v0.10.2
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/
mag.addons = {};
// helper function for non proxy supported browser i.e. NOT firefox
// state.fom = mag.addons.binds(state)
mag.addons.binds = function(data, attachTo, callback) {
  var oldVal,handler = function(e) {
    
    var val = e.target.type == 'checkbox' ? e.target.checked : e.target.value
    if (val === oldVal) return

    oldVal = val;

    var name = e.target.name
    if (data[name] && data[name].type == 'fun' && typeof data[name] == 'function') {
        data[name](val)
    } else if(name) {
      //necessary ?
      if(data[name] && typeof data[name]._text !=='undefined')
        data[name]._text=val
      else 
        data[name]=val
    }
      
    if(typeof Object.observe !== 'undefined'){
      Object.observe(data, function(changes) {
        // update target with changes
        changes.forEach(function(change) {
          if (change.type == 'update' || change.type == 'add') {
              // update the related dom
            if (e.target.name == change.name && e.target.value!==change.object[change.name])
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
        if (j) {
          if(document.querySelector('[name="' + j + '"]')){
            document.querySelector('[name="' + j + '"]').value=data[j]   
            //Why is this necesary?
            //if(isNew){document.querySelector('[name="' + j + '"]').click()}
        }
      }
    }
  }
  
  if (attachTo) mag.addons.merge(addThis, attachTo)
  
  return addThis
}

// simple bind to keyup event
// mag.addons.change(state, state.form={})
// state.form = mag.addons.change(state)
mag.addons.change=function(data, addTo){
  var src = {
    _onkeyup : function(e){
      data[e.target.name](e.target.value)
    }
  }
  if(addTo){
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
mag.addons.copy =function (o) {
   var out, v, key;
   out = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       out[key] = (typeof v === "object") ? mag.addons.copy(v) : v;
   }
   return out;
}

mag.addons.merge = function(source, destination) {
    for (var k in source) destination[k] = source[k]
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
  } else if(typeof condition === 'object') {
    condition.didload = function(e, n) {
      n.classList.remove('hide')
      // both or just if no class hide ..
      //node.style.display = 'none'
    }
  } else if (arguments.length == 0){
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
      }
    }
  } else if(arguments.length == 0){
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
mag.deferred = Deferred = function() {
  return function Deferred(resolve, reject) {
    Deferred.resolve = resolve
    Deferred.reject = reject
  }
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
  var newClass = data.value
  data.value = data.node.classList + ''
  if (!data.node.classList.contains(newClass)) {
    data.value = data.node.classList.length > 0 ? data.node.classList + ' ' + newClass : newClass
  }
    data.key = 'class'
})
