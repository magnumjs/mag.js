/*
MagJS v0.21
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag) {

  'use strict';


  var prop = {},
    MAGNUM = '__magnum__',
    cached = []

  prop.setup = function(index, callback) {


    var state = mag.mod.getState(index)
    var props = mag.mod.getProps(index)

    //var data = mag.utils.merge(state, props)

    if (!cached[index]) {

      observeNested(state, callback)
      observeNested(props, callback)

      cached[index] = 1
    }

  }



  var acceptList = ['add', 'update', 'delete', 'splice']

  function observeNested(obj, callback) {
    if (obj && typeof Object.observe !== 'undefined') {
      Object.observe(obj, function(changes) {
        changes.forEach(function(change) {

          if (typeof obj[change.name] == 'object') {

            if (change.type == 'update' && change.oldValue && typeof change.oldValue.draw == 'function' && change.object[change.name] && !change.object[change.name].draw) {
              // call unloader for module
              var id = change.oldValue.getId()
              mag.utils.callLCEvent('onunload', mag.mod.getState(id), mag.getNode(mag.mod.getId(id)), id, 1)
              mag.clear(id)
            }
            observeNested(obj[change.name], callback);
          }
        });
        callback.apply(this, arguments);
      }, acceptList);
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

      var onit = function(parent, event) {

        this[MAGNUM] = this[MAGNUM] || {}
        if (!this[MAGNUM].dirty) {
          this[MAGNUM].dirty = 1
        }
        
        if(['radio','checkbox'].indexOf(this.type)>-1){
          obj['_checked'] = this.checked;
          var idx =  mag.utils.items.getItem(parent.id)
          mag.redraw(parent, idx, 1)
        }
      }.bind(founder, parentElement)

      founder.addEventListener("click", onit, false);
      founder.addEventListener("focus", onit, false);

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

}(window.mag || {}));
