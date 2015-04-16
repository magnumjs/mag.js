;
(function(mag, configs, document, undefined) {

  "use strict";

  var ELEMENT_NODE = 1
  var cached = []

  // helper method to detect arrays -- silly javascript
    function _isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]'
    }

    // function _isNull(obj) {
    //   return Object.prototype.toString.call(obj) === '[object Null]'
    // }

    function getPathTo(element) {
      if (element.id !== '')
        return 'id("' + element.id + '")';
      if (element === document.body)
        return element.tagName;

      var ix = 0;
      if (!element.parentNode) return
      var siblings = element.parentNode.childNodes;
      for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
          return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
          ix++;
      }
    }

    function removeNode(node) {
      var p = getPathTo(node)
      // remove cache of all children too
      removeCache(p)
      node.parentNode.removeChild(node)
      // call config unload if any ?

      //console.log(p, cached[p + '-config'])
      if (cached[p + '-config'] && cached[p + '-config'].configContext && typeof cached[p + '-config'].configContext.onunload === 'function') {
        // what arg to send ?
        cached[p + '-config'].configContext.onunload()
      }
    }

    function removeCache(p) {
      // search cache for children

      delete cached[p]

      for (var k in cached) {
        if (k.indexOf(p) === 0) delete cached[k]
      }
    }

  var templates = {}
  var cached = [],
    firstRun = false;

  // this is the entry point for this module, to fill the dom with data
  function fill(nodeList, data, key) {

    var node
    var parent
    var dataIsArray

    // there is nothing to do if there is nothing to fill
    if (!nodeList) return

    // remove all child nodes if there is no data
    if (data == null) data = {
      _text: ''
    }

    // CACHE
    // DIFF
    // CHANGE? then modify only the changes
    // KEYS for indentification

    // nodeList updates as the dom changes, so freeze it in an array
    var elements = nodeListToArray(nodeList)

    dataIsArray = _isArray(data)



    // match the number of nodes to the number of data elements
    if (dataIsArray) {

      if (templates[key] && elements.length === 0) {

        templates[key].parent.insertAdjacentHTML("beforeend", templates[key].node);
        elements = nodeListToArray(templates[key].parent.children)

      }

      if (elements.length === 0) {

        //=====================================================================
        // Warning: the following is a case where we could end up here: A page
        // that returns search results as the user is typing. If the results
        // are empty, then the child nodes that display the results will all
        // be removed. Then a subsequent attempt to fill in the search results
        // with data won't have any dom elements to clone.
        //=====================================================================

        // cannot fill empty nodeList with an array of data
        return
      }
      // clone the first node if more nodes are needed
      parent = elements[0].parentNode

      if (!templates[key]) {
        templates[key] = {
          node: elements[0].cloneNode(true).outerHTML,
          parent: parent
        }
      }


      while (elements.length < data.length) {
        if (templates[key]) {
          parent.insertAdjacentHTML("beforeend", templates[key].node)
          node = parent.lastChild
        } else {
          node = elements[0].cloneNode(true)
        }

        elements.push(node)
        if (parent) parent.appendChild(node)
      }

      // remove the last node until the number of nodes matches the data
      while (elements.length > data.length) {
        node = elements.pop()
        parent = node.parentNode
        if (parent) {
          //var p = getPathTo(node)
          //console.log('removing', p, cached)

          removeNode(node)
        }
      }

    }

    // now fill each node with the data
    for (var i = 0; i < elements.length; i++) {
      var p = getPathTo(elements[i])
      if (dataIsArray) {
        if (elements[i]) {
          if (cached[p] && cached[p] === JSON.stringify(data[i])) {
            //console.log('same a', p, cached[p], JSON.stringify(data[i]))
            continue
          }
          // if (cached[p]) console.log('changed a', p)

          fill(elements[i], data[i])
          cached[p] = JSON.stringify(data[i])
        }
      } else {
        fillNode(elements[i], data)
      }

    }
    return nodeList
  }

  function fillNode(node, data) {
    var attributes,
      attrValue,
      element,
      elements

      // ignore functions
    if (typeof data === 'function') {
      return
    }

    // if the value is a simple property wrap it in the attributes hash
    if (typeof data !== 'object') return fillNode(node, {
      _text: data
    })

    // find all the attributes
    for (var key in data) {
      var value = data[key]

      // null values are treated like empty strings
      if (value === undefined) {
        value = ''
      } else if (value === null && ['onunload'].indexOf(key) === -1) {
        // TODO: delete case
        // special case delete all children if equal to null type  
        var matches = matchingElements(node, key)
        matches.forEach(function(item) {
          removeNode(item)
        })
      }

      // anything that starts with an underscore is an attribute
      if (key[0] === '_') {
        // store the properties to set them all at once
        // if (typeof value === 'string' || typeof value === 'number') {
        attributes = attributes || {}
        attributes[key.substr(1)] = value;
        // } else {
        //   throw new Error('Expected a string or number for "' + key +
        //                   '", got: "' + JSON.stringify(value) + '"');
        // }
      }
    }

    var p = getPathTo(node)

    // fill in all the attributes
    if (attributes) {

      // if (cached[p] && cached[p] === JSON.stringify(attributes)) {
      //   console.log('isame', p, JSON.stringify(attributes))
      // // return
      // }
      // console.log('called', node, attributes)
      fillAttributes(node, attributes)
      // console.log('ichange', p, JSON.stringify(attributes))
      // cached[p] = JSON.stringify(attributes)
    }

    var index = 0
    // look for non-attribute keys and recurse into those elements
    for (var key in data) {
      var value = data[key]

      // only attributes start with an underscore
      if (key[0] !== '_') {
        elements = matchingElements(node, key);

        // function 
        if (typeof value === 'function' && value.type == 'fun') {
          try {
            value = value()
          } catch (e) {}
        }

        // if is array make sure we load all elements not just the first for existing lists

        if (_isArray(value)) {
          elements = matchingElements(node, '$' + key);
        }

        fill(elements, value, p + '/' + key);

        index++
      }
    }
  }


  // freeze the NodeList into a real Array so it can't update as DOM changes
  function nodeListToArray(nodeList) {
    var temp;

    // wrap single item into an array for iteration
    // NOTE: can't use _isArray here, because it could be a NodeList (array-ish)
    if (nodeList.length == null) {
      nodeList = [nodeList];
    }

    // convert array-like object into a real array
    if (!_isArray(nodeList)) {
      temp = [];
      for (var i = 0; i < nodeList.length; i += 1) {
        // Note: occassionaly jsdom returns undefined elements in the NodeList
        if (nodeList[i]) {
          temp.push(nodeList[i]);
        }
      }
      nodeList = temp;
    }

    return nodeList;
  }


  // fill in the attributes on an element (setting text and html first)
  function fillAttributes(node, attributes) {


    var p = getPathTo(node),
      cache = false


    if (cached[p] && cached[p] === JSON.stringify(attributes)) {
      //console.log('isame', p, JSON.stringify(attributes))
      cache = true
    }

    // attach to topId so can be removed later

    node._events = node._events || []

    // set the rest of the attributes
    for (var attrName in attributes) {

      // skip text and html, they've already been set
      if (attrName === 'text' || attrName === 'html') continue

      // events
      if (attrName.indexOf('on') == 0) {
        // REALLY ? only one same event per node?
        if (node._events.indexOf(attrName) !== -1 && !firstRun) {
          // console.log('event exists', firstRun)
          continue
        }
        var eventCall = function(fun, node, e) {
          try {
            return fun.call(node, e)
          } finally {
            mag.redraw()
          }
        }.bind(null, attributes[attrName], node)

        node[attrName] = eventCall
        //console.log('event exists', firstRun)

        // node.addEventListener(attrName.substr(2), eventCall)
        node._events.push(attrName)

      } else {

        if (attrName == 'config') {

          // have we been here before?
          // does the element already exist in cache
          // useful to know if this is newly added
          var isNew = true
          console.log('config')

          var p = getPathTo(node)
          var tagIndex = parseInt(p.match(/\d+/g).pop()) - 1

          if (!cached[p + '-config']) {
            cached[p + '-config'] = {}
          } else {
            isNew = !isNew
          }

          var context = cached[p + '-config'].configContext = cached[p + '-config'].configContext || {}


          // console.log(p)
          // bind
          var callback = function(data, args) {
            return function() {
              return data.apply(data, args)
            }
          }

          configs.push(callback(attributes[attrName], [node, isNew, context, tagIndex]))
          continue
        }

        if (cache) continue
        if (attributes[attrName] === null) {
          node.removeAttribute(attrName)
        } else {
          node.setAttribute(attrName, attributes[attrName].toString())
        }

      }
    }

    // TODO: fix - this is not very accurate?
    if (cache) {
      //console.log(node.tagName, attributes)
      return
    }
    // set html after setting text because html overrides text
    setText(node, attributes.text)
    setHtml(node, attributes.html)

    //console.log('ichange', p, JSON.stringify(attributes))
    cached[p] = JSON.stringify(attributes)
  }

  function setText(node, text) {
    var child
    var children
    var p = getPathTo(node)

    // make sure that we have a node and text to insert
    if (!node || text == null) {
      return
    }
    // cache all of the child nodes
    if (!children) {
      children = [];
      for (var i = 0; i < node.childNodes.length; i += 1) {
        child = node.childNodes[i];
        if (child.nodeType === ELEMENT_NODE) {
          children.push(child)
        }
      }
    }

    // remove all of the children
    //WHY?
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }

    // SELECT|INPUT|TEXTAREA
    // now add the text
    if (node.nodeName.toLowerCase() === 'input') {
      // special case for input elements
      node.setAttribute('value', text.toString());
    } else {
      // create a new text node and stuff in the value
      node.appendChild(node.ownerDocument.createTextNode(text.toString()));
    }

    // reattach all the child nodes
    for (var i = 0; i < children.length; i += 1) {
      node.appendChild(children[i]);
    }
  }


  function setHtml(node, html) {
    if (!node || html == null) return;
    node.innerHTML = html;
    // CAN'T do below since it will append on every new call
    // node.insertAdjacentHTML("afterbegin", html)
  };


  //===========================================================================
  // TODO: Decide if the caching of element matching should be reintroduced.
  // The original implementation cached the lookup of elements, but it seems
  // like this will only be useful in cases where the same DOM elements are
  // getting filled mutliple times -- that seems like it would only happen
  // when someone is running performance benchmarks.
  //===========================================================================


  // find all of the matching elements (breadth-first)

  function matchingElements(node, key, nested) {
    var elements = childElements(node)
    var matches = []
    var keyName = key

    if (!(node.queryCache || {})[key]) {

      node.queryCache = (node.queryCache || {})[key] = [];

      var globalSearch = key[0] === '$'

      if (keyName[0] === '$') keyName = keyName.substr(1)

      // search all child elements for a match
      for (var i = 0; i < elements.length; i += 1) {
        if (elementMatcher(elements[i], keyName)) {
          matches.push(elements[i]);
        }
      }

      // if there is no match, recursively search the childNodes
      if (!matches.length || globalSearch) {
        for (var i = 0; i < elements.length; i++) {
          // NOTE: pass in a flag to prevent recursive calls from logging
          matches = matches.concat(matchingElements(elements[i], key, true))
          if (matches.length && !globalSearch) break
        }
      }

      if (!nested && !matches.length) {
        //'FILL - Warning: no matches found for "' + key + '"'
      }

      // return matches
      node.queryCache[key] = matches
    }
    return node.queryCache[key];
  }


  // return just the child nodes that are elements
  function childElements(node) {
    var children = node.childNodes
    var elements = []

    for (var i = 0; i < children.length; i += 1) {
      if (children[i].nodeType === ELEMENT_NODE) {
        elements.push(children[i])
      }
    }

    return elements
  }

  // match elements on tag, id, name, class name, data-bind, etc.
  function elementMatcher(element, key) {
    var paddedClass = ' ' + element.className + ' ';

    return (
      element.id === key ||
      paddedClass.indexOf(' ' + key + ' ') > -1 ||
      element.name === key ||
      element.nodeName.toLowerCase() === key.toLowerCase() ||
      element.getAttribute('data-bind') === key
    );
  }

  function clear() {
    //console.log('clear called')
    firstRun = true
    //CLEAR CACHE TOO?
    //cached=[]
  }

  function unclear() {
    firstRun = false
  }
  // attach fill to current context (in the browser this will be window.fill)
  // this.fill = fill;
  // this.configs = configs

  mag.fill = {
    fill: fill,
    find: matchingElements,
    clear: clear,
    unclear: unclear,
    configs: configs
  }
  window.mag = mag

}(window.mag || {}, [], document))
