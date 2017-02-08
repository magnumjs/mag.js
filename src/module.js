/*
MagJS v0.26.7
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
(function(mag) {

  'use strict';


  var modules = [],
    MAGNUM = mag.MAGNUM,
    controllers = []

  var mod = {
    runningViewInstance: -1,
    innerMods: [],
    cache: []
  }

  mod.getState = function(index) {
    return modules[index][1]
  }
  mod.setState = function(index, state) {
    modules[index][1] = state
  }
  mod.getView = function(index) {
    return modules[index][0]
  }
  mod.getProps = function(index) {
    return modules[index][2]
  }
  mod.setProps = function(index, props) {
    return modules[index][2] = props
  }
  mod.remove = function(index) {
    modules.splice(index, 1)
  }
  mod.getId = function(index) {
    return modules[index] && modules[index][3]
  }
  mod.exists = function(index) {
    return typeof modules[index] != 'undefined' ? true : false
  }
  mod.setFrameId = function(index, fid) {
    modules[index][4] = fid;
  }
  mod.getFrameId = function(index) {
    return modules[index][4];
  }
  mod.submodule = function(id, index, module, props) {
    if (modules[index]) {
      // new call to existing
      // update props, merge with existing if same key
      if (props.key && props.key === mod.getProps(index).key) {
        mod.setProps(index, mag.utils.copy(mag.utils.merge(mod.getProps(index), props)));
      } else {
        mod.setProps(index, props);
      }

      // reinitialize the controller ?
      return modules[index]
    }
    modules[index] = [0, 0, 0, 0, 0]
    mod.setProps(index, props);
    var controller = function(context) {
        return (module.controller || function() {}).call(context, mod.getProps(index)) || context
      },
      view = function(index, state, ele) {
        module.view && module.view.call(module, state, mod.getProps(index), ele)
      }.bind({}, index),
      output = {
        controller: controller,
        view: view
      }
    modules[index][0] = output.view;
    modules[index][3] = id;
    modules[index][1] = getController(output.controller, index, id);
    // register the module
    return modules[index]
  }

  var timers = [];

  function findMissing(change, element) {
    var prop = change.name;
    if (typeof change.object[change.name] == 'undefined' && prop[0] !== '_') {
      // prop might be hierarchical?
      // getparent Object property chain?

      // get value of property from DOM
      var a = mag.fill.find(element, prop),
        greedy = prop[0] === '$',
        // can be an array, object or string
        // for each
        tmp = [];

      if (!a.length) return MAGNUM;

      a.forEach(function(item) {
        var i;
        if (item && item.type && !~['submit', 'button'].indexOf(item.type)) {
          if (item.value && item.value.length > 0) {

            if (item.type == 'checkbox' || item.type == 'radio') {

              if (item.checked) {
                i = {};
                i._checked = true;
              }
              if (!greedy) {
                //if grouped name item
                var items = element.querySelectorAll('[name=' + item.name + ']');
                if (items.length) {
                  for (var sitem of items) {
                    if (sitem.checked) {
                      if (i) {
                        i._value = sitem.value;
                      } else {
                        i = {
                          _value: sitem.value
                        };
                      }
                    }
                  }
                }
              } else {
                if (i) {
                  i._value = item.value;
                } else {
                  i = {
                    _value: item.value
                  };
                }
              }
            } else {
              i = {
                _value: item.value
              };
            }
          }
        } else if ((typeof change.oldValue == 'undefined' && typeof change.object[change.name] == 'undefined') && item && !~['submit', 'button'].indexOf(item.type) && item.childNodes.length == 1 && item.childNodes[0].textContent.trim()) {
          i = {
            _text: item.childNodes[0].textContent.trim()
          };
        }
        if (i) tmp.push(i);
        else if (item && !item.hasChildNodes()) {
          tmp.push(MAGNUM)
        }

      });

      if (tmp.length === 0) return;
      else if (greedy) return tmp;
      else {
        return tmp[0] && typeof tmp[0]._value != 'undefined' ? tmp[0]._value : tmp[0] && tmp[0]._text ? tmp[0]._text : tmp[0]
      }
    }
  }

  var findParentNodeWithPath = function(node, path) {
    var snode = node;
    var parts = path.split('/');

    for (var prop of parts) {
      if (prop) {
        var a = mag.fill.find(snode, prop);
        if (a.length) {
          snode = a[0];
        }
      }
    }
    return snode
  };

  var handler = function(type, index, change) {

    if (change.type == 'get' && type != 'props' && !~mag.fill.ignorekeys.indexOf(change.name.toString()) && typeof change.oldValue == 'undefined') {

      var rootNode = mag.doc.getElementById(mod.getId(index));

      //Get parent correct parent not just root!?

      if (change.path && change.path[0] == '/') var fnode = findParentNodeWithPath(rootNode, change.path)

      var res = findMissing(change, fnode ? fnode : rootNode);

      if (typeof res != 'undefined' && typeof res == 'object' && change.object) {
        mag.utils.merge(res, change.object[change.name]);
      }
      if (typeof res != 'undefined') {
        mod.cached[index] = 0;
        return res;
      }
    } else if (change.type == 'set' && type != 'props' && change.object[change.name] && change.object[change.name].draw && typeof change.object[change.name].draw == 'function') {

      // setting a state prop to a module

      // call unloader for module
      mod.innerMods[mod.getId(index)] = [change.name, change.object[change.name]];
    }


    // call setup handler
    var fun = mod.getFrameId(index);
    if (typeof fun == 'function' && change.type == 'set') {
      //debounce
      cancelAnimationFrame(timers[index]);
      timers[index] = requestAnimationFrame(fun);
    }

  };


  function getController(ctrl, index, id) {
    var controller;

    mod.setProps(index, mag.proxy(mod.getProps(index), handler.bind({}, 'props', index), 'prop'));

    controller = new ctrl(mag.proxy({}, handler.bind({}, 'state', index)));

    return controller;
  }

  mod.iscached = function(key) {
    var data = JSON.stringify(mag.utils.merge(mag.utils.copy(mod.getProps(key)), mod.getState(key)));
    if (key in mod.cache && mod.cache[key] == data) {
      return true
    }
    mod.cache[key] = data;
  }

  mod.remove = function(key) {
    //remove mod completely
    if (modules[key]) modules[key] = 0
  }

  mod.clear = function(key) {
    if (~key && mod.cache[key]) {
      mod.cache.splice(key, 1);
    }
  }

  mod.cached = [];
  mod.callView = function(node, index) {
    //TODO: ASYNC, promises .. ?
    mod.runningViewInstance = index;
    if (!mod.cached[index]) {
      mag.props.attachToArgs(index, mod.getState(index), node)
      mod.cached[index] = 1
    }
    try {
      mod.getView(index)(mod.getState(index), node)
    } finally {
      mod.runningViewInstance = -1;
    }

  }


  mag.mod = mod;


}(mag));
