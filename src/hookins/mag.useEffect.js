import mag from '../main';
import {clone, arrayAreEqual} from './common';

const stateMap = {};


const checkExist = (name, ele, arr, stateMap, func) => {
    const checkExistID = setInterval(function () {
        if(mag.doc.body.contains(ele)) {
            clearInterval(checkExistID);
            exec(arr, stateMap, name, func)
        }
    }, 10);
}

const async = func => {
  return new Promise(resolve=>{
    requestAnimationFrame(()=>{
        const res = typeof func == 'function' && func();
        resolve(res)
    })
  })
}

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

        async(func)
            .then(callback => state.callback = callback)

        const destroyer = mag.utils.onLCEvent('onunload', name, () => {
            typeof state.callback == 'function' && state.callback();
            delete stateMap[name];
            destroyer();
        });
    } else if (state && !arr) {
        // call on every re-render
        //first call destroy
        typeof state.callback == 'function' && state.callback();
        async(func)
            .then(callback => state.callback = callback)
    } else if (state && !arrayAreEqual(arr, state.value)) {
        state.value = arr.slice();
        typeof state.callback == 'function' && state.callback();
        async(func)
            .then(callback => state.callback = callback)    }
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
