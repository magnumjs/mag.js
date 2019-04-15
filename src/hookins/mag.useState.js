import mag from '../main';
// Functional Toggle State: https://codepen.io/anon/pen/YMKzQv?editors=1010
// Functional Counter: https://codepen.io/anon/pen/wZwKqb?editors=1010

function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

const stateMap = {};

const copy = val => (isObject(val) ? Object.assign({}, val) : val);

const clone = function(obj) {
  var temp = function temporary() {
    return obj.apply(obj, arguments);
  };
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = obj[key];
    }
  }
  return temp;
};

const useState = function(initialValue) {
  const r = clone(mag._current);
  const name = r.key || r.id;
  const oprops = r.props;
  const render = r;
  const ele = r.element;
  let state = stateMap[name];

  if (!state) {
    const setValue = pvalue => {
      let temp;
      if (typeof pvalue == 'function') {
        temp = pvalue(state.value);
      }
      let value = copy(temp ? temp : pvalue);

      if (value !== state.value) {
        if (isObject(value)) {
          state.value = {...state.value, ...value};
        } else {
          state.value = value;
        }
        state.render({...oprops, _newProps: value});
      }
    };

    state = {
      name,
      setValue,
      render,
      value: copy(initialValue)
    };
    stateMap[name] = state;
  }

  //TODO: remove on unmounting for functional comps?
  // new MutationObserver(()=>if(e[0].removedNodes){}).observe(ele)
  return [state.value, state.setValue];
};

mag.useState = useState;

export {mag, useState};
