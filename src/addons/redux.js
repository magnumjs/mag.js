(function(window) {

  /*
  from: https://github.com/rackt/redux v3.0.3
  converted to plain es5 syntax
  example: http://jsbin.com/vonudoxabu/edit?js,console
  example2 : http://jsbin.com/wepulufeki/edit?js,console
  example3 : http://jsbin.com/kokeqikebo/edit?js,console
  MagJS Implementation basic : http://embed.plnkr.co/hpeKxjnnT2BxGeZtcuRP/
  MagJS Impl detailed : http://embed.plnkr.co/ngRhKORczy09F8bKyWc7/
  MagJS Impl detailed w/middleware : http://embed.plnkr.co/yRdpOiIXHVlEPsjjlclh/
  */

  'use strict';

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */
  var ActionTypes = {
    INIT: '@@redux/INIT'
  };

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [initialState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */

  function createStore(reducer, initialState) {
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = initialState;
    var listeners = [];
    var isDispatching = false;

    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */
    function getState() {
      return currentState;
    }

    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */
    function subscribe(listener) {
      listeners.push(listener);

      return function unsubscribe() {
        var index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    }

    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing â€œwhat changedâ€. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */
    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      listeners.slice().forEach(function(listener) {
        return listener();
      });
      return action;
    }

    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */
    function replaceReducer(nextReducer) {
      currentReducer = nextReducer;
      dispatch({
        type: ActionTypes.INIT
      });
    }

    // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.
    dispatch({
      type: ActionTypes.INIT
    });

    return {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    };
  }



  /**
   * Composes single-argument functions from right to left.
   *
   * @param {...Function} funcs The functions to compose.
   * @returns {Function} A function obtained by composing functions from right to
   * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
   */


  function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }

    return function(arg) {
      return funcs.reduceRight(function(composed, f) {
        return f(composed);
      }, arg);
    };
  }


  var fnToString = function fnToString(fn) {
    return Function.prototype.toString.call(fn);
  };

  /**
   * @param {any} obj The object to inspect.
   * @returns {boolean} True if the argument appears to be a plain object.
   */

  function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

    if (proto === null) {
      return true;
    }

    var constructor = proto.constructor;

    return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
  }



  function mapValues(obj, fn) {
    return Object.keys(obj).reduce(function(result, key) {
      result[key] = fn(obj[key], key);
      return result;
    }, {});
  }

  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };


  function pick(obj, fn) {
    return Object.keys(obj).reduce(function(result, key) {
      if (fn(obj[key])) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  }

  /**
   * Creates a store enhancer that applies middleware to the dispatch method
   * of the Redux store. This is handy for a variety of tasks, such as expressing
   * asynchronous actions in a concise manner, or logging every action payload.
   *
   * See `redux-thunk` package as an example of the Redux middleware.
   *
   * Because middleware is potentially asynchronous, this should be the first
   * store enhancer in the composition chain.
   *
   * Note that each middleware will be given the `dispatch` and `getState` functions
   * as named arguments.
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */

  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    return function(next) {
      return function(reducer, initialState) {
        var store = next(reducer, initialState);
        var _dispatch = store.dispatch;
        var chain = [];

        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch(action) {
            return _dispatch(action);
          }
        };
        chain = middlewares.map(function(middleware) {
          return middleware(middlewareAPI);
        });
        _dispatch = compose.apply(undefined, chain)(store.dispatch);

        return _extends({}, store, {
          dispatch: _dispatch
        });
      };
    };
  }



  function bindActionCreator(actionCreator, dispatch) {
    return function() {
      return dispatch(actionCreator.apply(undefined, arguments));
    };
  }

  /**
   * Turns an object whose values are action creators, into an object with the
   * same keys, but with every function wrapped into a `dispatch` call so they
   * may be invoked directly. This is just a convenience method, as you can call
   * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
   *
   * For convenience, you can also pass a single function as the first argument,
   * and get a function in return.
   *
   * @param {Function|Object} actionCreators An object whose values are action
   * creator functions. One handy way to obtain it is to use ES6 `import * as`
   * syntax. You may also pass a single function.
   *
   * @param {Function} dispatch The `dispatch` function available on your Redux
   * store.
   *
   * @returns {Function|Object} The object mimicking the original object, but with
   * every action creator wrapped into the `dispatch` call. If you passed a
   * function as `actionCreators`, the return value will also be a single
   * function.
   */

  function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
      return bindActionCreator(actionCreators, dispatch);
    }

    if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
      // eslint-disable-line no-eq-null
      throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
    }

    return mapValues(actionCreators, function(actionCreator) {
      return bindActionCreator(actionCreator, dispatch);
    });
  }


  /* eslint-disable no-console */

  function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

    return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
  }

  function getUnexpectedStateKeyWarningMessage(inputState, outputState, action) {
    var reducerKeys = Object.keys(outputState);
    var argumentName = action && action.type === ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

    if (reducerKeys.length === 0) {
      return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
    }

    if (!isPlainObject(inputState)) {
      return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
    }

    var unexpectedKeys = Object.keys(inputState).filter(function(key) {
      return reducerKeys.indexOf(key) < 0;
    });

    if (unexpectedKeys.length > 0) {
      return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
    }
  }

  function assertReducerSanity(reducers) {
    Object.keys(reducers).forEach(function(key) {
      var reducer = reducers[key];
      var initialState = reducer(undefined, {
        type: ActionTypes.INIT
      });

      if (typeof initialState === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
      }

      var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
      if (typeof reducer(undefined, {
          type: type
        }) === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
      }
    });
  }

  /**
   * Turns an object whose values are different reducer functions, into a single
   * reducer function. It will call every child reducer, and gather their results
   * into a single state object, whose keys correspond to the keys of the passed
   * reducer functions.
   *
   * @param {Object} reducers An object whose values correspond to different
   * reducer functions that need to be combined into one. One handy way to obtain
   * it is to use ES6 `import * as reducers` syntax. The reducers may never return
   * undefined for any action. Instead, they should return their initial state
   * if the state passed to them was undefined, and the current state for any
   * unrecognized action.
   *
   * @returns {Function} A reducer function that invokes every reducer inside the
   * passed object, and builds a state object with the same shape.
   */

  function combineReducers(reducers) {
    var finalReducers = pick(reducers, function(val) {
      return typeof val === 'function';
    });
    var sanityError;

    try {
      assertReducerSanity(finalReducers);
    } catch (e) {
      sanityError = e;
    }

    var defaultState = mapValues(finalReducers, function() {
      return undefined;
    });

    return function combination(state, action) {
      if (state === undefined) state = defaultState;

      if (sanityError) {
        throw sanityError;
      }

      var hasChanged = false;
      var finalState = mapValues(finalReducers, function(reducer, key) {
        var previousStateForKey = state[key];
        var nextStateForKey = reducer(previousStateForKey, action);
        if (typeof nextStateForKey === 'undefined') {
          var errorMessage = getUndefinedStateErrorMessage(key, action);
          throw new Error(errorMessage);
        }
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        return nextStateForKey;
      });

      if (true) {
        var warningMessage = getUnexpectedStateKeyWarningMessage(state, finalState, action);
        if (warningMessage) {
          console.error(warningMessage);
        }
      }

      return hasChanged ? finalState : state;
    };
  }




  window.Redux = {
    createStore:createStore,
    combineReducers:combineReducers,
    bindActionCreators:bindActionCreators,
    applyMiddleware:applyMiddleware,
    compose:compose
  };



})(window);

/*
function counter(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}


Redux.combineReducers(counter);
Redux.bindActionCreators(counter);
Redux.applyMiddleware();
Redux.compose();

var store = Redux.createStore(counter, 0);

store.dispatch({
  type: 'INCREMENT'
});
console.log(store.getState())

store.dispatch({
  type: 'DECREMENT'
});
console.log(store.getState())

store.dispatch({
  type: 'INCREMENT'
});
console.log(store.getState())
*/
