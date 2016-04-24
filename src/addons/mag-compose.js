/*
Name: mag-compose v0.1.2
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
    
    var cleanup, loading = true,
      mod,
      error;
    
    var _subscribe = function(newProps) {
      // unsubscribe first?
      if (cleanup) cleanup();

      prevProps = mag.copy(newProps);
      cleanup = handlerFunc(newProps, function(newestProps) {

        // if empty then set loading flag
        if (!Boolean(newestProps)) loading = false;

        if (loading) {
          // show loading component default or over ridden one
        }
        if (error) {
          //same as above
        }

        // foreach clones update for id
        mag.merge(newProps, newestProps);
        // attach to object
        mag.merge(mod().getProps(), newProps);

        mod().clones().length && mod().clones().forEach(function(clone) {
          // runner
          mod().getState(clone.instanceId).__i = 0;
          // attach to object
          mag.merge(mod().getProps(clone.instanceId), newProps);
        });

      });
    };

    component.controller = function(props) {

      // add other orig functions to this

      Object.keys(orig).forEach(function(key) {
        this[key] = orig[key]
      }.bind(this))

      var prevProps;
      this.willload = function(e, node, newProps) {
        _subscribe(newProps);
        if (orig.willload) orig.willload.apply(this, arguments);
      }

      this.willupdate = function(e, node, newProps) {
        _subscribe(newProps);
        if (JSON.stringify(prevProps) === JSON.stringify(newProps)) {
          e.preventDefault();
        } else {
          prevProps = mag.copy(newProps);
        }
        if (orig.willupdate) orig.willupdate.apply(this, arguments);

      }

    };

    mod = mag.create(id, component, props);

    return mod;
  }

}
