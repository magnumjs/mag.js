var createStore = function(intialState, reducer) {
  var currentState = intialState;
  var currentReducer = reducer;
  var listeners = [];

  function subscribe(listener) {
    listeners.push(listener)

    return function unsubscribe() {
      var index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    currentState = currentReducer(currentState, action)
    listeners.forEach(listener => listener(action, currentState))
  }
  
  //Init:
  dispatch({})

  return {
    subscribe,
    dispatch,
    getState: () => currentState
  }
}
