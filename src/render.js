/*
MagJS v0.24.6
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, global) {

  'use strict';

  var prop = {},
    MAGNUM = '__magnum__';

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
      var check = ['radio', 'checkbox'].indexOf(founder.type) > -1;

      var onit = function(parent, check, event) {

        this[MAGNUM] = this[MAGNUM] || {}
        if (!this[MAGNUM].dirty) {
          this[MAGNUM].dirty = 1
        }

        if (check) {
          obj['_checked'] = this.checked;
          mag.redraw(parent, mag.utils.items.getItem(parent.id), 1)
        }
      }.bind(founder, parentElement, check)

      founder.addEventListener("click", onit, false);
      founder.addEventListener("change", onit, false);
      founder.addEventListener("focus", onit, false);

      founder.eventOnFocus = 1;
    }
    return founder;
  }


  function isInput(items) {

    for (var k in items) {
      if (items[k] && ~['INPUT', 'SELECT', 'TEXTAREA'].indexOf(items[k].tagName)) {
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
          if (founder && founder.value !== 'undefined' && (founder[MAGNUM] && founder[MAGNUM].dirty) && founder.value !== oval) {

            oval = founder.value;
            mag.redraw(element, i, 1)

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
      if (args.hasOwnProperty(k)) {
        var value = args[k]

        if (typeof value === 'object' && !(value instanceof HTMLElement)) {
          // recurse
          attachToArgs(i + '.' + k, value, element);
        } else {
          attacher.bind({}, i, k, args, element)();
        }
      }
    }
  }
  prop.attachToArgs = attachToArgs
  mag.props = prop

}(mag));
