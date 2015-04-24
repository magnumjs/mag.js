/*
Mag.JS AddOns v0.1.3
(c) Michael Glazer
https://github.com/magnumjs/mag.js/new/master/new
*/
mag.addons = {};
// helper function for non proxy supported browser i.e. NOT firefox
// state.fom = mag.addons.binds(state)
mag.addons.binds = function(data, attachTo, callback) {
    var handler = function(e) {
        data[e.target.name] = e.target.type == 'checkbox' ? e.target.checked : e.target.value
        if(callback && typeof callback == 'function') callback()
    }
    var addThis = {}

    var events = ['_onchange', '_oninput']
    for (var k in events) addThis[events[k]] = handler
    if (attachTo) mag.addons.merge(addThis, attachTo)
    return addThis
};

mag.addons.when=function(arrayOfPromises, callback){
    Promise.all(arrayOfPromises).then(callback)
}

mag.addons.merge = function(source, destination) {
    for (var k in source) destination[k] = source[k]
}

// return object of getter values
mag.addons.getProp=function(data){
    var newData={}
    Object.keys(data).forEach(function(k){
        if(typeof data[k] == 'function') newData[k] = data[k]()
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


// hookin

mag.hookin('attributes', 'className', function(data) {
    if (!data.node.classList.contains(data.value)) {
        data.value = data.node.classList.length > 0 ? data.node.classList + ' ' + data.value : data.value
    }
    // same thing
    //data.node.classList.add(data.value)
    data.key = 'class'
})
