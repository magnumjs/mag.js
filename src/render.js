/*
MagJS v0.22.1
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag, global) {

  'use strict';

  var prop = {},
    MAGNUM = '__magnum__',
    cached = [],
    timers = [];

  prop.setup = function(index, callback) {

    if (!cached[index]) {
      var state = mag.mod.getState(index)
      var props = mag.mod.getProps(index)

      var proxState = proxyObject(state, function(change) {
        if (change.type == 'update' && change.oldValue && typeof change.oldValue.draw == 'function' && change.object[change.name] && !change.object[change.name].draw) {
          // call unloader for module
          var id = change.oldValue.getId()
          mag.utils.callLCEvent('onunload', mag.mod.getState(id), mag.getNode(mag.mod.getId(id)), id);
          mag.clear(id);
        }
        //debounce
        clearTimeout(timers[index]);
        timers[index] = setTimeout(function() {
          callback();
        });
      });
      var proxProps = proxyObject(props, callback);
      var proxProps = proxyObject(props, callback);

      mag.mod.setState(index, proxState);
      mag.mod.setProps(index, proxProps);

      cached[index] = 1
    }

  }

  function proxyAssign(obj, cb) {
    var last = [];

    return new Proxy(obj, {
      deleteProperty: function(proxy, name) {
        cb();
        return delete proxy[name];
      },
      set: function(proxy, name, value) {
        if (JSON.stringify(value) !== JSON.stringify(proxy[name])) {
          last[name] = proxy[name] && mag.utils.copy(proxy[name]);
        }

        cb({
          type: 'update',
          name: name,
          object: proxy,
          oldValue: last[name]
        });
        proxy[name] = value;

        return true;
      }
    });

  }

  function observer(obj, cb) {
    for (var k in obj) {
      if (Array.isArray(obj[k])) {
        // assign 
        obj[k] = proxyAssign(obj[k], cb)
      }
    }

    var p = proxyAssign(obj, cb)
    return p;
  }

  function proxyObject(obj, callback) {
    var p1 = {};
    if (obj && global.Proxy) {

      var handler = function(change) {

        if (typeof change.object[change.name] == 'object') {
          change.object[change.name] = proxyObject(change.object[change.name], callback);
        }

        callback(change);
      };

      p1 = observer(obj, handler);
      return p1;
    }
  }

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

      if (check) founder.addEventListener("click", onit, false);
      else founder.addEventListener("focus", onit, false);

      founder.eventOnFocus = 1;
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
  prop.cached = cached
  mag.props = prop

}(window.mag || {}, window));
