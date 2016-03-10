/*
Name: Mag-Redux v0.22
Description: MagJS Redux implementation
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
(c) 2016
@REQUIRES: redux.js - Redux & mag.js - mag
*/


;(function(Redux, mag) {

  'use strict';

//Thunk:
// TODO: put some where else, in redux.js ?
  Redux.thunkMiddleware = function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        return typeof action === 'function' ? action(dispatch, getState) : next(action);
      };
    };
  }


  var reduxCreateActions = function(actions) {
    var nactions = {}

    function convertArgs(props, args) {
      var object2 = Object.assign({}, props)
      delete object2['type']


      var keys = Object.keys(object2);
      args.forEach(function(val, k) {
        if (typeof object2[keys[k]] != 'undefined') object2[keys[k]] = val
      })

      return Object.assign({}, props, object2)
    }

    //Convert actions to functions:
    for (var k in actions) {
      if(typeof actions[k] == 'function'){
        nactions[k] = actions[k] 
        continue;
      }
      nactions[k] = function(acts) {
        var args = [].slice.call(arguments);
        [].shift.apply(args);

        return convertArgs(typeof acts == 'function' ? acts.apply({}, args) : acts, args)
      }.bind({}, actions[k])
    }

    return nactions;
  }

  mag.reduxConnect = function(mapStateToProps, mapDispatchToProps, reducers, middleware) {
  
    var creducers = Redux.combineReducers(reducers);
    var store;
  
    middleware = middleware || []
    middleware.push(Redux.thunkMiddleware)
  
    //Middleware:
    var createStoreWithMiddleware = Redux.applyMiddleware.apply({}, middleware)(Redux.createStore);
  
  
    // Store:
    store = createStoreWithMiddleware(creducers);
  
    //Actions to props:
    var props = {},
      stype = typeof mapStateToProps,
      mtype = typeof mapDispatchToProps;
    if (mtype == 'function') {
      props = mapDispatchToProps(store.dispatch)
    } else if (mtype == 'object') {
      mapDispatchToProps = reduxCreateActions(mapDispatchToProps)
      props = Redux.bindActionCreators(mapDispatchToProps, store.dispatch);
    }
  
  
    if (stype == 'object') mag.merge(props, store.getState())
  
    return function(id, module) {
  
      var instance;
      if (typeof id == 'string') {
  
        //Create Mag Instance:
        instance = mag.create(id, module, props)
  
      } else {
        instance = id;
        mag.merge(instance(props).getProps(), props);
      }
  
      store.subscribe(function() {
        var newProps = store.getState()
        if (stype == 'function') {
          newProps = mapStateToProps(store.getState());
        }
  
        mag.merge(instance(props).getProps(), newProps);
      })
      return instance
    }
  }
  
})(Redux, mag)
