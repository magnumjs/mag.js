import mag from '../core/mag';
import {clone, arrayAreEqual} from './common';
import {onLCEvent} from "../core/utils/events"

const stateMap = {};


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

        const destroyer = onLCEvent('onunload', name, () => {
            if (state.callback && typeof state.callback == 'function') {
                state.callback();
            }
            delete stateMap[name];
            destroyer();
        });
    } else if (state && !arr) {
        // call on every re-render
        typeof state.callback == 'function' && state.callback();
        state.callback =typeof func == 'function' && func();
    } else if (state && !arrayAreEqual(arr, state.value)) {
        state.value = arr.slice();
        typeof state.callback == 'function' && state.callback();
        state.callback =typeof func == 'function' && func();
    }
}

const useLayoutEffect = function(func, arr) {
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

            if(mag.doc.body.contains(args[2])) {
                exec(arr, stateMap, name, func)
            }else {
                checkExist(name, args[2], arr, stateMap, func)
            }

            destroy();
        })
    }
};

mag.useLayoutEffect = useLayoutEffect;

export {mag, useLayoutEffect};