import mag from '../core/mag';
import {useState} from './mag.useState';
import {copy, isFunction} from '../core/utils/common';

const stateMap = {};

const useContext = function(contextName, initialValue) {
  const current = mag._current;

  const [, setState] = useState();

  let state = stateMap[contextName];

  if (!state) {
    const setValue = pvalue => {
      let value = copy(pvalue);
      if (isFunction(pvalue)) {
        value = copy(pvalue(state.value));
      }
      state.value = value;

      state.updaters.forEach(fn => fn(value));
    };

    state = {contextName, setValue, updaters: new Set(), value: initialValue};
    stateMap[contextName] = state;
  }
  if (current && !current.fake) {
    state.updaters.add(setState);
  }
  return [state.value, state.setValue];
};

mag.useContext = useContext;

export {mag, useContext};
