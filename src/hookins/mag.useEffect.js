import mag from '../core/mag';
import {clone, arrayAreEqual, isFunction} from '../core/utils/common';
import {onLCEvent} from '../core/utils/events';

const stateMap = {};

const checkExist = (name, ele, arr, stateMap, func) => {
  const checkExistID = setInterval(function() {
    if (mag.doc.body.contains(ele)) {
      clearInterval(checkExistID);
      exec(arr, stateMap, name, func);
    }
  }, 10);
};

const async = func => {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const res = isFunction(func) && func();
      resolve(res);
    });
  });
};

const exec = (arr, stateMap, name, func) => {
  let state = stateMap[name];

  if (!state) {
    // initial call:
    // const callback = typeof func == 'function' && func();

    state = {
      name,
      func,
      value: arr && arr.slice()
    };

    stateMap[name] = state;

    async(func).then(callback => (state.callback = callback));

    const destroyer = onLCEvent('onunload', name, () => {
      isFunction(state.callback) && state.callback();
      delete stateMap[name];
      destroyer();
    });
  } else if (state && !arr) {
    // call on every re-render
    //first call destroy
    isFunction(state.callback) && state.callback();
    async(func).then(callback => (state.callback = callback));
  } else if (state && !arrayAreEqual(arr, state.value)) {
    state.value = arr.slice();
    isFunction(state.callback) && state.callback();
    async(func).then(callback => (state.callback = callback));
  }
};

const useEffect = function(func, arr) {
  const currentElement = mag._current.element;
  const r = clone(mag._current);
  const name = r.key || r.id;
  const oprops = r.props;
  const render = r;
  const ele = r.element;
  let state = stateMap[name];

  if (!r.fake) {
    //next tick

    const destroy = onLCEvent('didupdate', name, (...args) => {
      if (mag.doc.body.contains(args[2])) {
        exec(arr, stateMap, name, func);
      } else {
        checkExist(name, args[2], arr, stateMap, func);
      }

      destroy();
    });
  }
};

mag.useEffect = useEffect;

export {mag, useEffect};
