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
