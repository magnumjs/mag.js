/**
 * @name mag-dom-element.js selector finder for mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 * @link https://github.com/magnumjs/mag.js
 */
;
'use strict';
(function(magnum, namespace, window, document, undefined) {

  var ELEMENT_NODE = 1;
  var selectorDataKey = 'bind';

  magnum.domElement = function(nodeContext) {
    var control = new element(nodeContext);
    return control;
  };

  function element(nodeContext) {
    this.selectorDataKey = selectorDataKey;
    this.nodeContext = nodeContext || document;
  }

  element.prototype.getSelectorDataKey = function(key) {
    return this.selectorDataKey = key || this.selectorDataKey;
  };

  element.prototype.findElementsByKey = function(key, nodeContext) {
    var elements = this.matchingElements(nodeContext || this.nodeContext, key);
    return elements;
  };

  element.prototype.findElementsByKeys = function(data, nodeContext) {
    var elements = [];
    // look for non-attribute keys and recurse into those elements
    for (var key in data) {
      var eles = this.matchingElements(nodeContext || this.nodeContext, key);
      if (eles) {
        var item = {
          key: key,
          elements: eles
        };
        elements.push(item);
      }
    }
    return elements;
  };

  element.prototype.matchingElements = function(node, key, nested) {
    var elements = childElements(node)
    var matches = []
    var keyName = key

    for (var i = 0; i < elements.length; i += 1) {
      if (elementMatcher(elements[i], keyName, this.getSelectorDataKey())) {
        matches.push(elements[i]);
      }
    }

    for (var i = 0; i < elements.length; i++) {
      // NOTE: pass in a flag to prevent recursive calls from logging
      var more = this.matchingElements(elements[i], key, true);
      if (more && more.length > 0) {
        matches = matches.concat(more);
        break;
      }
    }

    if (!nested && !matches.length) {
      //log('FILL - Warning: no matches found for "' + key + '"');
      return false;
    }
    return matches
  }

  // return just the child nodes that are elements
  function childElements(node) {
    var children = node.childNodes
    var elements = []

    for (var i = 0; i < children.length; i += 1) {
      if (children[i].nodeType === ELEMENT_NODE) {
        elements.push(children[i]);
      }
    }

    return elements
  }
  // match elements on tag, id, name, class name, data-bind, etc.
  function elementMatcher(element, key, dataKey) {
    var paddedClass = ' ' + element.className + ' ';
    var attrKey = 'data-' + dataKey || 'bind';
    var attributes = element.attributes;
    if (attributes.length > 0) {
      for (var i = 0, size = attributes.length; i < size; i++) {
        if (element.attributes[i].nodeName.indexOf(attrKey) === 0) {
          var custom = element.attributes[i].nodeName.indexOf(attrKey);
          var partial = attributes[i].nodeName.substr(attrKey.length + 1);
          // should be returned or added to memory not added to dom
          element.setAttribute('mg-event', partial);
          return true;
        }
      };
    }

    return (
      element.id === key ||
      paddedClass.indexOf(' ' + key + ' ') > -1 ||
      element.name === key ||
      element.nodeName.toLowerCase() === key.toLowerCase() ||
      element.getAttribute(attrKey) === key
    );
  }

})(window.mag = window.mag || {}, mag.domElement = {}, window, document);
