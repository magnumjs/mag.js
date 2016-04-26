/*
Name: mag-compose v0.1.0
Description: side loading props based on react-komposer
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js(v0.22.9+) & mag addons
(c) 2016
*/


//Example: http://embed.plnkr.co/CfLJXUDnTmRc9xu3Pc48/

mag.composer = function(handlerFunc) {
  return function(id, ComposedComponent, oprops) {
    var orig = new(ComposedComponent.controller || mag.noop)();


    ComposedComponent.controller = function() {

      // add other orig functions to this
      Object.keys(orig).forEach(function(key) {
        this[key] = orig[key]
      }.bind(this));
      
      this.willgetprops = function() {
        _subscribe(arguments[3])
        if (orig.willgetprops) orig.willgetprops.apply(this, arguments);
      }
    }

    var composed = mag.module(id, ComposedComponent, oprops);
    var cleaners = [];
    var _findClone = function(props) {
      clones = composed.clones();
      clones.forEach(function(clone) {
        var cp = composed.getProps(clone.instanceId);

        if (cp.key == props.key) {
          mag.merge(cp, mag.copy(props));
          mag.redraw(mag.getNode(mag.getId(clone.instanceId)), clone.instanceId, 1);
        }

      })
    };
    var _subscribe = function(props) {
      if (cleaners[props.key]) cleaners[props.key]();
      cleaners[props.key] = handlerFunc(props, function(nprops) {
        _findClone(mag.merge(props, mag.copy(nprops)));
      });
    };

    var hoc = {
      controller: function(props) {
        this.willload = function() {
          props.key = props.key || performance.now();
          _subscribe(props);
        }

        var prevProps;
        this.willupdate = function(e, node, newProps) {
          if (JSON.stringify(prevProps) === JSON.stringify(newProps)) {
            e.preventDefault();
          } else {
            prevProps = mag.copy(newProps);
          }
        }
      },
      view: function(state, props) {
        state.div = composed(props);
      }
    };

    return mag.create('container', hoc, oprops);
  }
};
