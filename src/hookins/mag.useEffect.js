import mag from '../main';
import {clone} from './common';

const stateMap = {};

const arrayAreEqual = (array1, array2) =>
  array1.length === array2.length &&
  array1.every((value, index) => value === array2[index]);

const checkExist = (name, ele, arr, stateMap, func) => {
    const checkExistID = setInterval(function () {
        if(mag.doc.body.contains(ele)) {
            clearInterval(checkExistID);
            exec(arr, stateMap, name, func)
        }
    }, 10);
}

const exec = (arr, stateMap, name, func) => {
    let state = stateMap[name];

    if (!state) {
        // initial call:
        const callback = typeof func == 'function' && func();

        state = {
            name,
            func,
            callback,
            value: arr && arr.slice()
        };

        stateMap[name] = state;

        const destroyer = mag.utils.onLCEvent('onunload', name, () => {
            if (state.callback && typeof state.callback == 'function') {
                state.callback();
            }
            delete stateMap[name];
            destroyer();
        });
    } else if (state && !arr) {
        // call on every re-render
        typeof func == 'function' && func();
    } else if (state && !arrayAreEqual(arr, state.value)) {
        state.value = arr.slice();
        typeof func == 'function' && func();
    }
}

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

      const destroy = mag.utils.onLCEvent('didupdate', name, (...args) => {

          if(mag.doc.body.contains(args[2])) {
            exec(arr, stateMap, name, func)
          }else {
            checkExist(name, args[2], arr, stateMap, func)
          }

         destroy();
      })
  }
};

mag.useEffect = useEffect;

export {mag, useEffect};
