// Functional Toggle State: https://codepen.io/anon/pen/YMKzQv?editors=1010
// Functional Counter: https://codepen.io/anon/pen/wZwKqb?editors=1010

(function(mag){
  

function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

const stateMap = {};

const copy = val => (isObject(val) ? Object.assign({}, val) : val);


const useRender = function(initialValue, r){
  const name = r.id;
  const render = r
  const ele = r.element
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
        state.render({_newProps: value});
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
}

mag.useRender = useRender

}(mag))
