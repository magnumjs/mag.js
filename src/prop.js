/*
MagJS v0.17
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag) {

  'use strict';


  var prop = {}


  prop.setup = function(state, callback) {


    observeNested(state, callback)

  }


  var exclude = ['add', 'update', 'delete']

  function notifySubobjectChanges(object) {
    var notifier = Object.getNotifier(object); // get notifier for this object
    var handle = function(changes) { // observe the property value
      changes.forEach(function(change) { // and for each change
        notifier.notify(change);
      });
    }
    for (var k in object) { // loop over its properties
      var prop = object[k]; // get property value
      if (!prop || typeof prop !== 'object') break; // skip over non-objects
      if (typeof Array.observe !== 'undefined' && Array.isArray(prop)) {
        Array.observe(prop, handle, exclude);
      } else {
        Object.observe(prop, handle, exclude);
      }
      notifySubobjectChanges(prop); // repeat for sub-subproperties
    }
  }


  function observeNested(obj, callback) {
    if (obj && typeof Object.observe !== 'undefined') {
      // var handler = callback
      notifySubobjectChanges(obj); // set up recursive observers
      Object.observe(obj, callback, exclude);
      //Object.unobserve(obj, handler);
    }
  }


  var obvProp = {}

  var getParent = function(parts, parentElement) {
    for (var i = 1; i < parts.length; i += 2) {
      var key = parts[i];
      var index = parts[i + 1];
      parentElement = mag.fill.find(parentElement, key);
      parentElement = parentElement[index];
    }
    return parentElement;
  };
  var getElement = function(obj, k, i, parentElement) {

    // search within _key if there
    var parts = i.toString().split('.'),
      found;

    if (parts.length >= 3) {
      // recurse
      parentElement = getParent(parts, parentElement)
      found = mag.fill.find(parentElement, k);

    } else {

      var last = parseInt(parts.pop()),
        index = !isNaN(last) ? last : 0;
      found = mag.fill.find(parentElement[index] ? parentElement[index] : parentElement, k);
    }
    // first user input field
    var founder = isInput(found);
    if (founder && !founder.eventOnFocus) {

      var onfocus = function() {
        if (!this.classList.contains('ion-dirty')) {
          this.classList.add('ion-dirty');
        }
      }

      founder.addEventListener("focus", onfocus, false);
      founder.eventOnFocus = true;
    }
    return founder;
  }


  function isInput(items) {

    for (var k in items) {
      if (items[k] && ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(items[k].tagName) !== -1) {
        return items[k];
      }
    }
    return false;
  }

  var attacher = function(i, k, obj, element) {
    var oval = obj[k];
    // if k =='_value' use parent
    if (k === '_value') k = i.split('.').pop();

    // only for user input fields
    var found = mag.fill.find(element, k);
    var founder = isInput(found);
    if (typeof oval !== 'function' && founder) {

      var founderCall = getElement.bind({}, obj, k, i, element);
      founderCall();
      Object.defineProperty(obj, k, {
        configurable: true,
        get: function() {
          var founder = founderCall();

          // set on focus listener once
          if (founder && founder.value !== 'undefined' && founder.classList.contains('ion-dirty') && founder.value !== oval) {
            oval = founder.value;
            mag.redraw(element, i)
            return founder.value;
          }
          return oval;
        },
        set: function(newValue) {
          var founder = founderCall();

          if (founder && founder.value !== 'undefined' && founder.value !== newValue && newValue !== oval) {
            founder.value = newValue;
            oval = newValue;


          }
        }
      });
    }
  };

  var attachToArgs = function(i, args, element) {
    for (var k in args) {
      var value = args[k]

      if (typeof value === 'object') {
        // recurse
        attachToArgs(i + '.' + k, value, element);
      } else {
        attacher.bind({}, i, k, args, element)();
      }
    }
  }
  prop.attachToArgs = attachToArgs

  mag.prop = prop

}(window.mag || {}));
