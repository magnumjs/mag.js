/*
Name: Mag-template v0.1.1
Description: run mag.create by html url
Example:

var promise = mag.template(
  'my-template.html', 
  component, 
  props)
  .then((magInstance) => {
    magInstance(newProps)
  });

Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js & mag addons
(c) 2017
*/

;
(function(mag, document) {

  'use strict';
  var attached = [];

  var getParentNode = function(parentInstance) {
    var parentId = mag.getId(parentInstance);
    var parentNode = mag.getNode(parentId);
    return parentNode;
  };

  mag.template = function(url, component, props) {

    return mag.request({
        url: url,
        cache: true
      })
      .then(function(data) {

        //get html as node
        var template = document.createElement('template');
        template.innerHTML = data;
        var newNode = template.content.children[0];
        newNode.id = newNode.id || performance.now();
        var id = newNode.id;
        var instance = mag.module(newNode, component, props);

        var parentInstance = mag.mod.runningViewInstance;

        instance.subscribe(function(parentInst) {
          console.log('called')
            //only once
          if (!attached[id]) {
            var parentNode = getParentNode(parentInst);
            //Attach to parent instance if available
            (parentNode || document).body.appendChild(newNode);
            attached[id] = 1;
          }
        }.bind(null, parentInstance))
        return instance;
      });
  };

})(mag, document);
