/*
MagJS v0.28.9
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, global) {

  'use strict';

  var prop = {},
    _VALUE = '_value',
    MAGNUM = mag.MAGNUM;


  //TODO: make recursive and clean!
  var getParent = function(parts, parentElement) {
    for (var i = 1; i < parts.length; i++) {
      var key = parts[i];
      var index = parts[i + 1];
      var found = mag.fill.find(Array.isArray(parentElement) ? parentElement[0] : parentElement, key);

      if (index && !isNaN(Number(index))) {
        parentElement = found[index];
      } else if (found && found.length && index && i + 2 < parts.length) {
        parentElement = mag.fill.find(found[0], index);
      } else if (found && found.length) {
        parentElement = found
        if (i + 2 == parts.length) {
          break;
        }
      }
    }
    return Array.isArray(parentElement) ? parentElement[0] : parentElement;
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

    return syncUIWatcher(found, obj, k, parentElement);
  }

  function syncUIWatcher(found, obj, k, parentElement) {

    var items = []
    for (var i in found) {

      var founder = found[i];

      if (isDynaInput(founder)) {
        // add to return list
        items.push(founder);
        addEvent(founder, obj, k, parentElement);
      }
    }

    if (items.length) {
      if (items.length == 1) {
        return items[0]
      }
      return items;
    }
    return false;
  }

  function addEvent(founder, obj, k, parentElement) {

    founder[MAGNUM] = founder[MAGNUM] || {}

    if (!founder[MAGNUM].eventOnFocus) {

      var onit = function(parent, obj, k, event) {

        var check = ~['radio', 'checkbox'].indexOf(founder.type);

        if (!this[MAGNUM].dirty) {
          this[MAGNUM].dirty = 1
        }

        if (founder.selectedOptions) {
          var vals = [].map.call(founder.selectedOptions, x => x.value)
        }
        if (check) {
          if ('_checked' in obj || _VALUE in obj) {
            obj['_checked'] = this.checked;
          } else if (this.checked) {
            obj[k] = this.value;
          }
        } else if (obj[_VALUE] !== undefined) {
          obj[_VALUE] = vals || this.value;
        } else if (obj._text !== undefined) {
          obj._text = vals || this.value;
        }
        mag.redraw(parent, mag.utils.items.getItem(parent.id));

      }.bind(founder, parentElement, obj, k);

      founder.addEventListener("click", onit, false);
      founder.addEventListener("input", onit, false);
      founder.addEventListener("focus", onit, false);

      founder[MAGNUM].eventOnFocus = 1;
    }
  }

  function isDynaInput(item) {
    return item && ~['INPUT', 'SELECT', 'TEXTAREA'].indexOf(item.tagName);
  }

  function isInput(items) {

    for (var k in items) {
      if (isDynaInput(items[k])) {
        return items[k];
      }
    }
    return false;
  }

  var attacher = function(i, k, obj, element) {
    var oval = obj[k];

    // if k =='VALUE' use parent
    if (~[_VALUE, '_checked', '_text'].indexOf(k) && typeof i == 'string') {
      k = i.split('.').pop();
    }


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

        if (k != _VALUE && typeof value === 'object' && !mag.utils.isHTMLEle(value)) {
          if (mag.utils.isObject(value) && mag.utils.isEmpty(value)) {
            value[_VALUE] = ''
          }
          // recurse
          attachToArgs(i + '.' + k, value, element);
        } else {
          attacher.bind({}, i, k, args, element)();
        }
      }
    }
  };

  prop.attachToArgs = attachToArgs
  mag.props = prop

}(mag));
