/*
Mag.JS AddOns v0.1.6
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
        data[name] = val
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
