/*
Name: Mag-register v0.1.1
Description: run mag.module for by tagName(s)
Example:

var instances = mag.register(
  'my-tag', 
  component, 
  props);

Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js & mag addons
(c) 2017
*/

;
(function(mag, document) {

  'use strict';

  var nodeCache = [];

  //Allow for by TagName?
  //wrapper for mag.module for tagNames - returns multiple instances
  mag.register = function(tagName, mod, props) {

    //Are we in a parent run?

    // mag.mod.runningViewInstance

    var cacheId = tagName + (mag.mod.runningViewInstance ? mag.mod.runningViewInstance : 0);

    //Check if in cache?
    if (nodeCache[cacheId]) {

      //console.log('cached', cacheId, nodeCache[cacheId]);
    }

    var nodes = setIdByTagName(tagName);
    var instances = [];

    if (nodes.length) {
      for (var item of nodes) {
        var instance = mag.module(item, mod, props);
        instances.push(instance);
      }
    }
    return instances;
  };

  function setIdByTagName(id) {
    var parentNode;
    if (typeof mag.mod.runningViewInstance != 'undefined') {
      var parentID = mag.utils.items.getItemVal(mag.mod.runningViewInstance);
      parentNode = getNode(parentID);
    }

    var nodes = (parentNode || mag.doc).getElementsByTagName(id);

    if (nodes.length) {
      for (var node of nodes) {
        if (!node.id) node.id = performance.now();
        nodeCache[node.id] = node;
      }
    }
    return nodes;
  }
})(mag, document);
