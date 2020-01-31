import mag from '../main';
import {clone} from './common';

const stateMap = {};

const arrayAreEqual = (array1, array2) =>
  array1.length === array2.length &&
  array1.every((value, index) => value === array2[index]);

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

      if (!state) {
        // initial call:
        const callback = typeof func == 'function' && func();

        state = {
          name,
          func,
          callback,
          render,
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
};

mag.useEffect = useEffect;

export {mag, useEffect};
