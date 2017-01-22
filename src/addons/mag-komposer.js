/*
Name: mag-komposer v0.2.2
Description: side loading props based on react-komposer (https://github.com/kadirahq/react-komposer)
Let's compose MagJS containers and feed data into components. 
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js(v0.25.7) & mag addons 0.22.5
(c) 2017
Simple Example: http://embed.plnkr.co/RkCuy0xoyUZyMjSPRKeH/
Full Example: http://embed.plnkr.co/LoI7vOx1KAZkaA8dZSJX/
*/

mag.komposer = function(handlerFunc, loadingComp, errorComp) {
  return function(composed) {
    var lnode = document.createElement('div');
    lnode.appendChild(lnode.cloneNode());

    loadingComp = loadingComp || mag.create(lnode, {
      view: function(state) {
        state.div = 'Loading...';
      }
    });

    //Default error component can be over ridden:
    var enode = document.createElement('div');
    enode.appendChild(enode.cloneNode());

    errorComp = errorComp || mag.create(enode, {
      view: function(state, props) {
        state.div = {
          _text: props.message,
          _style: 'color:red',
        };
      }
    });

    var cleaners = [],
      errors = [],
      loading = [];
    var _subscribe = function(props, instanceID) {
      //why is this here, onunload?
      if (cleaners[props.key]) cleaners[props.key]();

      cleaners[props.key] = handlerFunc(props, function(key, ids, nprops) {

        loading[key] = false;
        var cp = composed().getProps(ids);

        if (nprops instanceof Error) {
          errors[key] = true;
          error = {};
          Object.getOwnPropertyNames(nprops).forEach(function(skey) {
            error[skey] = nprops[skey];
          });
          mag.merge(cp, error);

        } else {
          mag.merge(cp, nprops);
        }

        var rnode = mag.getNode(mag.getId(ids));
        if (rnode) {
          mag.redraw(rnode, ids);
        }

      }.bind({}, props.key, instanceID));
    };

    var prevProps = [];
    var hoc = {
      controller: function(props) {
        if (!props.key) props.key = performance.now();
        loading[props.key] = true;

        this.willgetprops = function(node, cprops, instanceId) {
          _subscribe(cprops, instanceId)
        };
        this.willupdate = function(node, newProps) {
          // prevent layout thrashing on init when no props
          //TODO: real use case?

          //don't rerun when unecessary
          if (newProps.key && JSON.stringify(prevProps[newProps.key]) === JSON.stringify(newProps)) {
            return false;
          } else {
            prevProps[newProps.key] = mag.copy(newProps);
          }
        }
      },
      view: function(state, props) {
        //is loading?
        if (loading[props.key]) {
          state.div = loadingComp(props);
          return;
        }
        //is error?
        if (errors[props.key]) {
          state.div = errorComp(props);
          return;
        }
        state.div = composed(props);
      }
    };

    // virtual node
    var node = document.createElement('div');
    node.appendChild(node.cloneNode())

    return mag.create(node, hoc);
  }
};
