/*
Name: mag-compose v0.1.4
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
    var ERRORID = performance.now();
    var loadingHtml = '<div class="' + LOADINGID + '">Loading ...</div>';
    var errorHtml = '<div class="' + ERRORID + '">Error: <error></error></div>';

    var cleanup, loading = true,
      iserror = false,
      mod,
      error;

    var _isError = function() {
      return iserror;
    };
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
          iserror = true;
          //console.log('Error!', newestProps)
        } else {

          // foreach clones update for id
          // mag.merge(newProps, newestProps);
          // attach to object
          mag.merge(mod.getProps(), newestProps);
          mod.draw(1);
        }
      });

    };

    var cleaners = [];

    function _runClones() {

      mod.clones().length && mod.clones().forEach(function(clone) {

        var newProps = mod.getProps(clone.instanceId);
        cleaners[clone.instanceId] && cleaners[clone.instanceId]();

        cleaners[clone.instanceId] = handlerFunc(newProps, function(id, newestProps) {

          if (newestProps instanceof Error) {
            //same as above
            iserror = true;
            console.log('ErrorME!', newestProps)
          } else {

            // if change from previous then force draw

            // attach to object
            mag.merge(mod.getProps(id), newestProps);

            mag.redraw(mag.getNode(mag.getId(id)), id, 1)
          }
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
        if (_isLoading()) {
          // node.insertAdjacentHTML('afterbegin', loadingHtml);
          // node.insertAdjacentHTML('afterbegin', errorHtml);
          // hide error
          // mag.show(false, this[ERRORID] = {});
        }
        _subscribe(newProps);
        if (orig.willload) orig.willload.apply(this, arguments);
      };

      this.willupdate = function(e, node, newProps) {

        if (_isError()) {
          // show once

        }

        //_subscribe(newProps);
        _runClones();

        if (JSON.stringify(prevProps) === JSON.stringify(newProps)) {
          e.preventDefault();
        } else {
          prevProps = mag.copy(newProps);
        }
        if (orig.willupdate) orig.willupdate.apply(this, arguments);

      }

    };

    component.view = function(state) {
      if (!_isLoading()) {
        // mag.show(false, state[LOADINGID] = {});
      }
      if (_isError()) {
        // mag.show(true, state[ERRORID] = {});
      }
      view.apply(this, arguments);
    }
    mod = mag.module(id, component, props);

    return mod;
  }

}
