/*
Name: mag-compose v0.1.3
Description: side loading props based on react-komposer
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js & mag addons
(c) 2016
*/

//Example: http://embed.plnkr.co/qHPO1brJWe4R4t6PcnRB/
//Simple: without mag.compose http://jsbin.com/jixewaziha/edit?js,output

mag.compose = function(handlerFunc) {

  return function(id, component, props) {

    // modify component controller to watch updates
    //save original

    var orig = new(component.controller || mag.noop)();
    var view = component.view || mag.noop;
    var LOADINGID = performance.now();
    var loadingHtml = '<div id="' + LOADINGID + '">Loading ...</div>';
    var cleanup, loading = true,
      mod,
      error;


    var _isLoading = function() {
      return loading;
    };
    var _subscribe = function(newProps) {
      // unsubscribe first?
      if (cleanup) cleanup();

      prevProps = mag.copy(newProps);
      cleanup = handlerFunc(newProps, function(newestProps) {

        // if empty then set loading flag
        if (Boolean(newestProps)) loading = false;


        if (newestProps instanceof Error) {
          //same as above
        }

        // foreach clones update for id
        mag.merge(newProps, newestProps);
        // attach to object
        mag.merge(mod.getProps(), newProps);
      });

    };

    var cleaners = [];

    function _runClones() {

      mod.clones().length && mod.clones().forEach(function(clone) {

        var newProps = mod.getProps(clone.instanceId);
        cleaners[clone.instanceId] && cleaners[clone.instanceId]();

        cleaners[clone.instanceId] = handlerFunc(newProps, function(id, newestProps) {

          // if change from previous then force draw
          mod.getState(id).$$i = performance.now();

          // attach to object
          mag.merge(newProps, newestProps);
          // attach to object
          mag.merge(mod.getProps(id), newProps);
        }.bind({}, clone.instanceId));

      });
    }
    component.controller = function(props) {

      // add other orig functions to this

      Object.keys(orig).forEach(function(key) {
        this[key] = orig[key]
      }.bind(this))

      var prevProps;
      this.willload = function(e, node, newProps) {
        // if (_isLoading()) {
        //   node.insertAdjacentHTML('afterbegin', loadingHtml);
        // }
        _subscribe(newProps);
        if (orig.willload) orig.willload.apply(this, arguments);
      };

      this.willupdate = function(e, node, newProps) {
        _subscribe(newProps);
        _runClones();

        if (JSON.stringify(prevProps) === JSON.stringify(newProps)) {
          e.preventDefault();
        } else {
          prevProps = mag.copy(newProps);
        }
        if (orig.willupdate) orig.willupdate.apply(this, arguments);

      }

    };

    // component.view = function(state) {

    //   if (!_isLoading()) {
    //     state[LOADINGID] = null;
    //   }
    //   view.apply(this, arguments);
    // }
    mod = mag.module(id, component, props);

    return mod;
  }

}
