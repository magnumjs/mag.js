//Example: http://jsbin.com/rilenacalu/3/edit?js,output

(function(mag) {

  mag.MAGNUM = '__magnum__'

  mag.hookin('attributes', 'bind', function(data) {
    //Been here already?
    if (data.node[mag.MAGNUM].events && 'input-bind' in data.node[mag.MAGNUM].events) {
      //remove attribute from html
      data.value = null

    } else {

      //add
      data.node[mag.MAGNUM].events = data.node[mag.MAGNUM].events || [];
      data.node[mag.MAGNUM].events['input-bind'] = 1;

      var fun = function(templateID, bindKey, e) {
        var moduleID = mag.utils.items.getItem(templateID);

        //TODO: sure add to state? what about nested keys, non string values?
        mag.mod.getState(moduleID)[bindKey] = e.target.value;

        //TODO: add directly to node value?
        //       var node = mag.find(moduleID, key);

        //       console.log(moduleID, key, e.target.value, node);

      }.bind({}, mag.fill.id, data.value);

      data.node.addEventListener('input', fun, false);

      //remove attribute from html
      data.value = null
    }

  });

}(mag));
