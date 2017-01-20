/*
Name: Mag-template v0.1.2
Description: run mag.create by html url
Example:

var promise = mag.template(
  'my-template.html', 
  component, 
  props)
  .then((magInstance) => {
    magInstance.subscribe(function(state, props, node){
      console.log('updated')
    })
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
        //If no node id default with performance props.key becomes redudant.
        newNode.id = newNode.id + (props.key || '');
        var id = newNode.id;
        var instance = mag.module(newNode, component, props);

        var parentInstance = mag.mod.runningViewInstance;

        instance.subscribe(function(parentInst, nid) {

          //only once
          if (!attached[nid]) {
            var parentNode = getParentNode(parentInst);
            //Attach to parent instance if available
            (parentNode || mag.doc.body).appendChild(newNode);
            attached[nid] = 1;
          }
        }.bind(null, parentInstance, id))

        return instance;
      });
  };

})(mag, document);
