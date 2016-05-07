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

    errorComp = errorComp ||  mag.create(enode, {
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

        requestAnimationFrame(function() {
          mag.redraw(mag.getNode(mag.getId(ids)), ids);
        })
      }.bind({}, props.key, instanceID));
    };

    var prevProps = [];
    var hoc = {
      controller: function(props) {
        loading[props.key] = true;

        this.willgetprops = function() {
          _subscribe(arguments[4], arguments[3])
        }
        this.willupdate = function(e, node, newProps) {
          // prevent layout thrashing on init when no props
          if (Object.keys(newProps).length < 1) e.preventDefault();

          //don't rerun when unecessary
          if (newProps.key && JSON.stringify(prevProps[newProps.key]) === JSON.stringify(newProps)) {
            e.preventDefault();
          } else {
            prevProps[newProps.key] = mag.utils.copy(newProps);
          }
        }
      },
      view: function(state, props) {
        if (loading[props.key]) {
          state.div = loadingComp(props);
          return;
        }
        //is error?
        if (errors[props.key]) {
          state.div = errorComp(props);
          return;
        }
        //is loading?
        state.div = composed(props);
      }
    };

    // virtual node
    var node = document.createElement('div');
    node.appendChild(node.cloneNode())

    return mag.create(node, hoc);
  }
};
