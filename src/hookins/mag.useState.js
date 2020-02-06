import mag from '../core/mag';
import {clone, copy, isObject} from '../core/utils/common';
// Functional Toggle State: https://codepen.io/anon/pen/YMKzQv?editors=1010
// Functional Counter: https://codepen.io/anon/pen/wZwKqb?editors=1010

const stateMap = {};

const useState = function(initialValue) {
  const r = clone(mag._current);
  const name = r.key || r.id;
  const oprops = r.props;
  const render = r;
  const ele = r.element;
  let state = stateMap[name];

  if (!state) {
    const setValue = pvalue => {
      let temp, value = copy(pvalue);
      if (typeof pvalue == 'function') {
        value = copy(pvalue(state.value));
      }
      if (value !== state.value) {
        if (isObject(value)) {
          state.value = {...state.value, ...value};
        } else {
          state.value = value;
        }
        state.render({...oprops});
      }
    };

    state = {
      name,
      setValue,
      render,
      value: copy(initialValue)
    };
    stateMap[name] = state;

    // const destroy = mag.utils.onLCEvent('onunload', name, () => {
    //   delete stateMap[name];
    //   destroy();
    // });
  }

  return [state.value, state.setValue];
};

mag.useState = useState;

export {mag, useState};
