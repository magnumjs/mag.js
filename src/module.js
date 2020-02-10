import proxy from './mag-proxy';
import {MAGNUM, ignorekeys} from './core/constants';
import {merge, copy, toJson, isFunction, isUndefined, isObject} from "./core/utils/common"
import {items} from "./utils"
import getNode from "./core/dom/getNode"
import attachToArgs from "./render"

var modules = [],
  controllers = [];

var mod = {
  runningViewInstance: -1,
  cache: []
};

let runningViewInstance = mod.runningViewInstance
const innerMods = mod.innerMods = []

const getState = mod.getState = function(index) {
  return modules[index][1];
};
mod.setState = function(index, state) {
  modules[index][1] = state;
};
mod.getView = function(index) {
  return modules[index][0];
};
const getProps = mod.getProps = function(index) {
  return modules[index] && modules[index][2];
};
mod.setProps = function(index, props) {
  return (modules[index][2] = props);
};
const remove = mod.remove = function(key) {
  //remove mod completely
  if (modules[key]) modules[key] = 0;
};
const getModId = mod.getId = function(index) {
  return modules[index] && modules[index][3]
};
const exists = mod.exists = function(index) {
  return isObject(modules[index])
};
const setFrameId = mod.setFrameId = function(index, fid) {
  modules[index][4] = fid;
};
mod.getFrameId = function(index) {
  return modules[index][4];
};
const getMod = mod.getMod = function(index) {
  return modules[index] && modules[index][5];
};

var bindMethods = (obj, context) => {
  context = context || obj;

  for (var key in obj) {
    var val = obj[key];

    if (isFunction(val) && !~['controller', 'view'].indexOf(key)) {
      obj[key] = val.bind(context);
    }
  }

  return obj;
};

const submodule = function(id, index, module, props) {
  if (modules[index]) {
    // new call to existing
    // update props, merge with existing if same key
    if (props.key && props.key == mod.getProps(index).key) {
      mod.setProps(
        index,
        copy(merge(mod.getProps(index), props))
      );
    } else {
      mod.setProps(index, props);
    }
    // reinitialize the controller ?
    return modules[index];
  }

  module = copy(module);
  bindMethods(module, module);

  modules[index] = [0, 0, 0, 0, 0, 0];
  mod.setProps(index, props);
  var controller = function(context) {
      module.props = mod.getProps(index);
      module.state = context;
      module.element = getNode(id);
      return (
        (module.controller || function() {}).call(context, module.props) ||
        context
      );
    },
    view = function(index, state, ele) {
      module.element = ele;
      module.state = state;
      module.props = mod.getProps(index);
      module.view && module.view.call(module, state, module.props, ele);
    }.bind({}, index),
    output = {
      controller: controller,
      view: view
    };
  modules[index][0] = output.view;
  modules[index][3] = id;
  modules[index][1] = getController(output.controller, index, id);
  modules[index][5] = module;
  // register the module
  return modules[index];
};

var timers = [];

function findMissing(change, element) {
  var prop = change.name;
  if (isUndefined(change.object[change.name]) && prop[0] != '_') {
    // prop might be hierarchical?
    // getparent Object property chain?

    // get value of property from DOM
    var a = mag._find(element, prop),
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
            var vals =
              item.multiple &&
              Array.prototype.map.call(item.selectedOptions, x => x.value);

            i = {
              _value: vals || item.value
            };
          }
        }
      } else if (
          isUndefined(change.oldValue) &&
          isUndefined(change.object[change.name]) &&
        item &&
        !~['submit', 'button'].indexOf(item.type) &&
        item.childNodes.length == 1 &&
        item.childNodes[0].textContent.trim()
      ) {
        i = {
          _text: item.childNodes[0].textContent.trim()
        };
      }
      if (i) tmp.push(i);
      else if (item && !item.hasChildNodes()) {
        tmp.push(MAGNUM);
      }
    });

    if (tmp.length === 0) return;
    else if (greedy) return tmp;
    else {
      return tmp[0] && !isUndefined (tmp[0]._value)
        ? tmp[0]._value
        : tmp[0] && tmp[0]._text
        ? tmp[0]._text
        : tmp[0];
    }
  } else if (prop[0] == '_') {
    var attr = prop.substr(1);

    if (element.length) {
      var tmp = [];
      for (var k in element) {
        var ele = element[k];
        var has = ele[attr];
        if (isUndefined(has)) has = ele.getAttribute(attr);
        tmp.push(has);
      }
      return tmp;
    } else {
      var has = element[attr];
      if (isUndefined(has)) has = element.getAttribute(attr);
      return has;
    }
  }
}

var findParentNodeWithPath = function(node, path) {
  var snode = node;
  var parts = path.split('/');

  for (var prop of parts) {
    if (prop) {
      var a = mag._find(snode, prop);
      if (a.length) {
        snode = a;
      }
    }
  }
  return snode;
};

var handler = function(type, index, change) {
  if (
    change.type == 'get' &&
    type != 'props' &&
    !~ignorekeys.indexOf(change.name.toString()) &&
    isUndefined(change.oldValue)
  ) {
    var rootNode = getNode(mod.getId(index));

    //Get parent correct parent not just root!?
    if (change.path && change.path[0] == '/')
      var fnode = findParentNodeWithPath(rootNode, change.path);

    // if greedy pass all elements
    if (fnode && change.path.split('/').pop()[0] != '$') {
      fnode = fnode[0];
    }

    var res = findMissing(change, fnode ? fnode : rootNode);

    if (res !== null && isObject(res) && change.object) {
      merge(res, change.object[change.name]);
    }
    if (res) {
      mod.cached[index] = 0;
      return res;
    }
  } else if (
    change.type == 'set' &&
    type != 'props' &&
    change.object[change.name] &&
    change.object[change.name].draw &&
    isFunction(change.object[change.name].draw)
  ) {
    // setting a state prop to a module

    // call unloader for module
    mod.innerMods[mod.getId(index)] = [change.name, change.object[change.name]];
  }

  // call setup handler
  var fun = mod.getFrameId(index);
  if (isFunction(fun) && change.type == 'set') {
    //debounce
    cancelAnimationFrame(timers[index]);
    timers[index] = requestAnimationFrame(fun);
  }
};

function getController(ctrl, index, id) {
  //mod.setProps(index, proxy(mod.getProps(index), handler.bind({}, 'props', index), 'prop'));

  return new ctrl(proxy({}, handler.bind({}, 'state', index)));
}

const iscached = mod.iscached = function(key) {
  //TODO: shallow equals
  var data = toJson([mod.getProps(key), mod.getState(key)]);
  if (key in mod.cache && mod.cache[key] == data) {
    return true;
  }
  mod.cache[key] = data;
};

const clear = mod.clear = function(key) {
  if (~key && mod.cache[key]) {
    mod.cache.splice(key, 1);
  }
};

mod.cached = [];
const callView = function(node, index) {
  //TODO: ASYNC, promises .. ?
  mod.runningViewInstance = index;
  if (!mod.cached[index]) {
    attachToArgs(index, mod.getState(index), node);
    mod.cached[index] = 1;
  }
  try {
    if (mod.exists(index)) {
      mod.getView(index)(mod.getState(index), node);
    }
  } finally {
    mod.runningViewInstance = -1;
  }
};

const isValidId = function(nodeId, idInstance) {
    // verify idInstance
    if (idInstance < 0 || idInstance != items.getItem(nodeId)) {
        // if original id is a match
        if (nodeId == getModId(idInstance)) return true;
        return false;
    }
    return true;
};

export {
    isValidId,
    callView,
    iscached,
    setFrameId,
    runningViewInstance,
    exists,
    getProps,
    getMod,
    clear,
    submodule,
    remove,
    getModId,
    getState,
    innerMods
}