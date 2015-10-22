/*

es5 compliant redux middleware
*/

//Promises resolution:
/*
//Example with no side effects
var actions = {
 loadData : function(param){
  return {
    type : types.ACTION_LOAD,
    promise : promiseFun(param),
    param
  }
}

//Example with side effects (calls other actions) - Thunk
var actions = {
  loadData: function() {
    return function(dispatch) {
      return getData().then(function(data) {
        //Another action w/Promise:
        dispatch({
          type: types.SET_DATA,
          promise: data.json()
        })
      })
    }
  }
}
*/

Redux.middle= {}

Redux.middle.readyStatePromise = function readyStatePromise(store) {
  return function(next) {
    return function(action) {

      if (!action.promise) {
        return next(action);
      }

      function makeAction(ready, data) {
        var newAction = Object.assign({}, action, {
          ready: ready
        }, data);
        delete newAction.promise;
        return newAction;
      }

      var SUCCESS = FAILURE = REQUEST = action.type;

      if (action.types && Array.isArray(action.types)) {
        REQUEST = action.types[0];
        SUCCESS = action.types[1];
        FAILURE = action.types[2];
      }

      next(makeAction(false, {
        type: REQUEST
      }));
      return action.promise.then(function(result) {
        return next(makeAction(true, {
          result: result,
          type: SUCCESS
        }));
      }, function(error) {
        return next(makeAction(true, {
          error: error,
          type: FAILURE
        }));
      });
    };
  };
};

Redux.middle.logger = function logger(store) {
  return function(next) {
    return function(action) {
      console.log('dispatching', action);
      var result = next(action);
      console.log('next state', store.getState());
      return result;
    };
  };
};
