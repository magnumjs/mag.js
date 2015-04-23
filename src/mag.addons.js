/*
Mag.JS AddOns v0.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js/new/master/new
*/
mag.addons={};
// helper function for non proxy supported browser i.e. NOT firefox
mag.addons.binds=function(data) {
  return {
    _onchange: function(e) {
      data[e.target.name] = e.target.value;
    }
  };
};

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
  if(data.node.classList.indexOf(data.value)===-1){
    data.value = data.node.classList + ' ' + data.value
    data.key = 'class'
  }
})
