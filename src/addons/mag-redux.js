/*
Name: Mag-Redux
Description: MagJS Redux implementation
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
(c) 2015
*/


(function(Redux, mag) {

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

    if (middleware) {
      //Middleware:
      var createStoreWithMiddleware = Redux.applyMiddleware(middleware)(Redux.createStore);


      // Store:
      store = createStoreWithMiddleware(creducers);
    } else {

      // Store:
      store = Redux.createStore(creducers);

    }
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


      //Create Mag Instance:
      var instance = mag.create(id, module, props)

      store.subscribe(function() {
        var newProps = store.getState()
        if (stype == 'function') {
          newProps = mapStateToProps(store.getState());
        }

        mag.merge(instance().getProps(), newProps);
      })
      return instance
    }
  }
  
})(Redux, mag)
