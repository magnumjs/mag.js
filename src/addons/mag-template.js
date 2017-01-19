/*
Name: Mag-template v0.1.1
Description: run mag.module by html url, returns instance in promise
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

//TODO: what about within a module, mag.create or attach to a specific node?

;
(function(mag, document) {

  'use strict';
  var attached = [];
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
        var id = newNode.id;
        var instance = mag.module(newNode, component, props);
        
        instance.subscribe(function() {
          //only once
          if (!attached[id]) {
            document.body.appendChild(newNode);
            attached[id] = 1;
          }
        })
        return instance;
      });
  };

})(mag, document);
