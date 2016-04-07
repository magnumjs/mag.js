
//Example: http://embed.plnkr.co/3cpw0dTJH033loC098rU/
mag.compose = function(handlerFunc) {

  return function(id, component, props) {

    // modify component controller to watch updates
    //save original

    var orig = new (component.controller || mag.noop);

    component.controller = function(props) {

      // add other orig functions to this

      Object.keys(orig).forEach(function(key) {
        this[key] = orig[key]
      }.bind(this))

      var prevProps;
      this.willload = function(e, node, newProps) {
        prevProps = mag.copy(newProps);
        handlerFunc(newProps, function(newestProps) {

          mag.merge(newProps, newestProps);
          // attach to object
          mag.merge(mod().getProps(), newProps);
        });
        if (orig.willload) orig.willload(e, node, newProps)
      }

      this.willupdate = function(e, node, newProps) {

        if (JSON.stringify(prevProps) === JSON.stringify(newProps)) {
          e.preventDefault();
        } else {
          prevProps = mag.copy(newProps);
        }
        if (orig.willupdate) orig.willupdate(e, node, newProps)

      }

    };

    var mod = mag.create(id, component)

    return mod;

  }

}
