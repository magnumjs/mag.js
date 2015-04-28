/*
Mag.JS AddOns v0.1.7
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/
mag.addons = {};
// helper function for non proxy supported browser i.e. NOT firefox
// state.fom = mag.addons.binds(state)
mag.addons.binds = function(data, attachTo, callback) {
  var handler = function(e) {
    var val = e.target.type == 'checkbox' ? e.target.checked : e.target.value
    var name = e.target.name
    if (data[name] && data[name].type == 'fun' && typeof data[name] == 'function') {
        data[name](val)
    } else if(name) {
      //necessary ?
      if(data[name] && 'undefined'!==data[name]._text)
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
            if (e.target.name == change.name)
                e.target.value = change.object[change.name]
          }
        })
      })
    }
    if (callback && typeof callback == 'function') callback()
  }
  var addThis = {}

  var events = ['_onclick', '_onchange', '_oninput']
  for (var k in events) addThis[events[k]] = handler

  addThis['_config'] = function(node, isNew) {
    if (isNew) {
        for (var j in data) {
            if (j) {
             document.querySelector('[name="' + j + '"]')?
               document.querySelector('[name="' + j + '"]').click() : 0
            }
        }
    }
  }
  if (attachTo) mag.addons.merge(addThis, attachTo)

  return addThis
}

mag.addons.when = function(arrayOfPromises, callback) {
    Promise.all(arrayOfPromises).then(callback)
}

//UTILITY
mag.addons.copy =function (o) {
   var out, v, key;
   out = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       out[key] = (typeof v === "object") ? copy(v) : v;
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

mag.addons.show = function(condition) {
    return {
        _config: function(n) {
            if (!condition) n.style.display = 'none';
            else n.style.display = 'block';
        }
    };
}

mag.addons.hide = function(condition) {
    return {
        _config: function(n) {
            if (condition) n.style.display = 'none';
        }
    }
}


mag.addons.onload = function(element) {
    element.classList.remove("hide")
};

mag.deferred = Deferred = function() {
  return function Deferred(resolve, reject) {
    Deferred.resolve = resolve
    Deferred.reject = reject
  }
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
    data.value = null
})

mag.hookin('attributes', 'className', function(data) {
    if (!data.node.classList.contains(data.value)) {
        data.value = data.node.classList.length > 0 ? data.node.classList + ' ' + data.value : data.value
    }
    // same thing
    //data.node.classList.add(data.value)
    data.key = 'class'
})
