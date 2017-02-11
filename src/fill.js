/*
MagJS v0.26.7
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
Originally ported from: https://github.com/profit-strategies/fill/blob/master/src/fill.js
*/

(function(mag, configs, undefined) {

  'use strict';


  var fill = {
    cached: [],
    ignorekeys: ['toString', 'draw', 'then', 'hasOwnProperty', 'willgetprops', 'onbeforeunload', 'Symbol(Symbol.toStringTag)', 'nodeType', 'toJSON', 'onunload', 'willupdate', 'didupdate', 'didload', 'willload', 'isupdate']
  }

  var cached = fill.cached,
    MAGNUM = mag.MAGNUM,
    FUNCTION = 'function',
    UNDEFINED = 'undefined',
    MAGNUM_KEY = '_key',
    xpathCache = [],
    dataCache = [],
    templates = {};


  // helper method to detect arrays -- silly javascript
  function _isArray(obj) {
    return Array.isArray(obj)
  }
  var inc = 0;

  function getUid(element, clear) {
    element[MAGNUM] = element[MAGNUM] || {}
    if (!element[MAGNUM].uid || clear) element[MAGNUM].uid = ++inc
    return element[MAGNUM].uid
  }

  function getPathTo(element, clear) {
    //add UID if does not exists
    var uid = getUid(element, clear)
    if (xpathCache[uid]) return xpathCache[uid]
    else return xpathCache[uid] = getPathTo3(element)
  }

  function isCached(element, data, clear) {
    //add UID if does not exist
    var uid = getUid(element, clear)
    dataCache[fill.id] = dataCache[fill.id] || []
    if (dataCache[fill.id][uid] && dataCache[fill.id][uid] == data) return 1
    else dataCache[fill.id][uid] = data
  }

  function findClosestId(node) {
    if (node.id) return node
    if (node.parentNode) return findClosestId(node.parentNode)
  }

  function getPathTo3(element) {
    var str = '',
      par = findClosestId(element),
      ix = element.parentNode && [].indexOf.call(element.parentNode.children, element);

    if (par) {
      str += 'id("' + par.id + '")';
    }
    str += '/' + element.tagName + '[' + (ix + 1) + ']';
    return str;
  }

  function getPathTo2(element) {
    if (element.id && fill.id === element.id)
      return 'id("' + element.id + '")';
    if (element === mag.doc.body)
      return element.tagName;

    var ix = 0;
    if (!element.parentNode) return
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i];
      if (sibling === element)
        return getPathTo2(element.parentNode) + (element.tagName ? '/' + element.tagName + '[' + (ix + 1) + ']' : '');
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
        ix++;
    }
  }

  function removeNode(node) {
    var p = getPathTo2(node);
    // call config unload if any ?		
    if (node && cached[p + '-config'] && cached[p + '-config'].configContext && typeof cached[p + '-config'].configContext.onunload === FUNCTION) {
      // what arg to send ?		
      cached[p + '-config'].configContext.onunload(cached[p + '-config'].configContext, node, p)
        // remove self when done?
      delete cached[p + '-config'];
      delete fill.configs[p];
    }

    //TODO: remove cache of all children too		
    node.parentNode && node.parentNode.removeChild(node);

    //remove 'view' cache due to dom change ? recursion
    mag.mod.cached[mag.utils.items.getItem(fill.id)] = 0;

  }
  // TODO: get index from getPathTo function		
  function getPathIndex(p) {
    var s = p && parseInt(p.split('[').pop().slice(0, -1))
    if (!s) return 0
    return parseInt(s) - 1
  }

  function getPathId(p) {
    //id("mathdemo3")		
    return p && ~p.indexOf('id(') && p.split('id("')[1].split('")')[0]
  }


  // this is the entry point for this module, to fill the dom with data
  fill.run = function(nodeList, data, key) {
    var node, dataIsArray


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

      if (!elements.length) {
        // should never reach here
        // cannot fill empty nodeList with an array of data
        return
      }

      // clone the first node if more nodes are needed
      var parent = elements[0].parentNode;

      if (!templates[key]) {
        templates[key] = {
          node: elements[0].cloneNode(1).outerHTML,
          parent: parent
        }
      }

      //Adding
      while (elements.length < data.length) {
        if (templates[key]) {
          parent.insertAdjacentHTML("beforeend", templates[key].node)
          node = parent.lastChild
        } else {
          node = elements[0].cloneNode(1)
        }

        elements.push(node)
        if (parent) parent.appendChild(node)
      }
      // loop thru to make sure no undefined keys

      var keys = data.map(function(i) {
        return i && i[MAGNUM_KEY]
      })

      // add keys if equal
      if (elements.length == data.length || keys.indexOf(undefined) !== -1) {


        // changes data can cause recursion!
        data = data.map(function(d, i) {

          if (typeof d === 'object') {
            elements[i][MAGNUM] = elements[i][MAGNUM] || {};
            if (elements[i][MAGNUM].__key && typeof d[MAGNUM_KEY] === UNDEFINED) {
              d[MAGNUM_KEY] = elements[i][MAGNUM].__key
              return d
            }
            if (typeof d[MAGNUM_KEY] === UNDEFINED) {
              d[MAGNUM_KEY] = MAGNUM + i
            }
            elements[i][MAGNUM].__key = d[MAGNUM_KEY]
          }

          return d
        })
      }
      if (elements.length > data.length) {
        if (data.length === 0 || typeof data[0] !== 'object') {

          while (elements.length > data.length) {
            node = elements.pop();
            parent = node.parentNode;
            if (parent) {
              removeNode(node)
            }
          }


        } else {
          // more elements than data
          // remove elements that don't have matching data keys

          var found = []
            // get all data keys
          var m = data.map(function(i) {
            return i[MAGNUM_KEY]
          })

          elements = elements.filter(function(ele, i) {
            var remove;
            if (typeof ele[MAGNUM] == UNDEFINED) {
              remove = 1
            } else
            if (!~m.indexOf(ele[MAGNUM].__key) || ~found.indexOf(ele[MAGNUM].__key)) {
              found.push(ele[MAGNUM].__key)
              remove = 1
            }
            if (remove) {
              removeNode(ele)
              return false
            }
            found.push(ele[MAGNUM].__key)
            return true
          })

        }
      }
    }

    // now fill each node with the data
    for (var i = 0; i < elements.length; i++) {

      // create element specific xpath string
      if (dataIsArray) {
        if (elements[i]) {
          fill.run(elements[i], data[i])
        }
      } else {
        var p = getPathTo(elements[i])

        if (data && typeof data === "object") {
          elements[i][MAGNUM] = elements[i][MAGNUM] || {}

          if (data[MAGNUM_KEY] !== undefined) {
            elements[i][MAGNUM].isChildOfArray = true

            // if (mag.utils.isHTMLEle(data)) {
            elements[i][MAGNUM].dataPass = data[MAGNUM]
              //} else {
              // elements[i][MAGNUM].dataPass = data
              //}
          }
          elements[i][MAGNUM].xpath = p;
        }

        fillNode(elements[i], data, p)
      }

    }
  }


  function findParentChild(node) {
    if (node && node[MAGNUM] && node[MAGNUM].isChildOfArray) {
      return node
    } else if (node.parentNode) {
      // continue to walk up parent tree 
      return findParentChild(node.parentNode)
    }
  }

  function addToNode(node, val, clear) {


    //TODO: finer grain diffing, attach once
    if (isCached(node, val.outerHTML, clear)) {
      return;
    }
    if ((!val.id && !node.childNodes[0]) || (val.id && !mag.doc.getElementById(val.id)) || (node.firstChild && !node.firstChild.isEqualNode(val))) {
      while (node.lastChild) {
        node.removeChild(node.lastChild)
      }
      node.appendChild(val);
    }
  }


  function findAllAttributes(node, data) {
    var attributes;

    for (var key in data) {
      var value = data[key]

      // null values are treated like empty strings
      if (value === undefined) {
        value = ''
      } else if (value === null && ['onunload'].indexOf(key) === -1) {
        // TODO: delete case
        // special case delete all children if equal to null type  

        node[MAGNUM].detached = node[MAGNUM].detached || []

        node[MAGNUM].detached[key] = 1

        removeChildren(node, key)

      } else if (node[MAGNUM].detached && node[MAGNUM].detached[key]) {

        reattachChildren(node, key)

        node[MAGNUM].detached[key] = 0

      }
      // anything that starts with an underscore is an attribute
      if (key[0] === '_' && key[1] !== '_') {
        attributes = attributes || {}
        attributes[key.substr(1)] = value;
      }
    }
    return attributes;
  }

  function findNonAttributes(node, data, p) {
    var elements;

    for (var key in data) {
      var value = data[key]

      // ignore certain system keys
      if (~fill.ignorekeys.indexOf(key)) continue;

      // only attributes start with an underscore
      if (key[0] !== '_') {
        elements = matchingElements(node, key);


        // hookins
        var data2 = {
          key: key,
          value: value,
          node: node
        }
        mag.hook('values', '*', data2)
          // change
        if (data2.change) {
          value = data2.value
        }

        if (_isArray(value)) {
          elements = matchingElements(node, '$' + key);
        }

        fill.run(elements, value, p + '/' + key);
      }
    }
  }

  var functionHandler = function(data, node, tagIndex, p) {

    var par = findParentChild(node.parentNode),
      key = par && par.getAttribute('key');
    if (par && key) {
      tagIndex = +key.split(MAGNUM)[1]
    }

    var val = data(tagIndex)

    if (val && mag.utils.isHTMLEle(val)) {
      // remove childs first
      addToNode(node, val);


      node[MAGNUM] = node[MAGNUM] || {}
      node[MAGNUM].isChildOfArray = true
      node[MAGNUM].dataPass = {
        index: tagIndex
      }
      data.draw && data.draw();
      return;
    } else {

      // TODO: is this a valid use case?

      var type = /<[a-z][\s\S]*>/i.test(val) ? '_html' : '_text'
      var obj = {}
      obj[type] = val
      return fillNode(node, obj, p)
    }

  }

  function fillNode(node, data, p) {
    var attributes;
    var attrValue;

    var element;
    var elements;

    var tagIndex = getPathIndex(p)

    if (data && mag.utils.isHTMLEle(data)) {
      addToNode(node, data)
      return;
    }

    if (typeof data === 'function') {
      // ignore functions
      return functionHandler(data, node, tagIndex, p);
    }

    // if the value is a simple property wrap it in the attributes hash
    if (typeof data !== 'object') return fillNode(node, {
      _text: data
    }, p)

    //TODO: should be a default plugin hookin not just another if
    // check for unloaded inner modules then call unload
    if (mag.mod.innerMods[fill.id] && data[mag.mod.innerMods[fill.id][0]] && !data[mag.mod.innerMods[fill.id][0]].draw) {
      // call destroy handler
      mag.mod.innerMods[fill.id][1].destroy();
    }
    // find all the attributes
    attributes = findAllAttributes(node, data);

    // fill in all the attributes
    if (attributes) {
      fillAttributes(node, attributes, p)
    }

    // look for non-attribute keys and recurse into those elements
    findNonAttributes(node, data, p);
  }

  var childCache = []

  function reattachChildren(node, key) {
    var matches = matchingElements(node, key)
    matches.forEach(function(item) {
      var uid = getUid(item)
      if (uid in childCache) {
        for (var index in childCache[uid]) {
          item.appendChild(childCache[uid][index])
        }
        delete childCache[uid];
      }
    })
  }

  function removeChildren(node, key) {

    var called = 0,
      expected = 1;
    var continuation = function(item) {
      if (++called === expected) {
        // remove children
        while (item.lastChild) {
          removeNode(item.lastChild)
        }
      }
    }

    var checkForMod = function(node, onremove) {
      var instanceID;
      if (node.id && mag.utils.items.isItem(node.id)) {
        instanceID = mag.utils.items.getItem(node.id);
      }
      // chek if onbeforeunload exists
      if (instanceID && mag.mod.getState(instanceID).onbeforeunload) {
        expected++;
        //call first
        //TODO: call children nodes with hooks too
        mag.utils.callLCEvent('onbeforeunload', mag.mod.getState(instanceID), node, instanceID, 0, function() {
          if (instanceID) mag.utils.callLCEvent('onunload', mag.mod.getState(instanceID), node, instanceID);
          onremove();
        })
      } else {
        if (instanceID) mag.utils.callLCEvent('onunload', mag.mod.getState(instanceID), node, instanceID);
        onremove();
      }
    }

    var matches = matchingElements(node, key);

    matches.forEach(function(item) {
      var uid = getUid(item);
      if (item.children.length) childCache[uid] = nodeListToArray(item.children);

      var called = 0;
      // check child cache for unloaders
      for (var k in childCache[uid]) {
        var child = childCache[uid][k];
        checkForMod(child, function() {
          continuation(item);
        });
      }
      continuation(item);
    });


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

  function createEventCall(node, attributes, attrName) {

    var eventCall = function(fun, node, e) {

      var dataParent = findParentChild(node),
        path = dataParent && getPathTo2(dataParent),
        parentIndex = getPathIndex(path),
        xpath = getPathTo(node, 1),
        tagIndex = getPathIndex(xpath),
        parent = {
          path: path,
          data: ((dataParent || {})[MAGNUM] || []).dataPass,
          node: dataParent,
          index: parentIndex
        }

      var id = getPathId(xpath)
      var nodee = mag.doc.getElementById(id)

      // What if ret is a promise?
      var ret = fun.call(node, e, tagIndex, node, parent)
      if (id && nodee) {
        var redraw = function() {
          mag.redraw(nodee, mag.utils.items.getItem(id), 1)
        }
        if (ret && ret.then) {
          //Node outdated?
          ret.then(function(res) {
            redraw();
            return res;
          });
        } else {
          redraw()
        }

      }

      return ret
    }.bind({}, attributes[attrName], node)

    return eventCall;
  }

  // fill in the attributes on an element (setting text and html first)
  function fillAttributes(node, attributes, p) {
    var tagIndex = getPathIndex(p);

    cached[getUid(node)] = cached[getUid(node)] || [];

    // set the rest of the attributes
    for (var attrName in attributes) {

      // skip text and html, they've already been set
      if (attrName === 'text' || attrName === 'html') continue


      // events
      if (attrName.indexOf('on') == 0) {

        node[attrName.toLowerCase()] = createEventCall(node, attributes, attrName)

      } else {

        if (attrName == 'config') {

          var p = getPathTo2(node),
            tagIndex = getPathIndex(p);

          // have we been here before?
          // does the element already exist in cache
          // useful to know if this is newly added

          var isNew = true

          if (!cached[p + '-config']) {
            cached[p + '-config'] = {}
          } else {
            isNew = false
          }

          var context = cached[p + '-config'].configContext = cached[p + '-config'].configContext || {}


          // bind
          var callback = function(data, args) {
            return function() {
              return data.apply(data, args)
            }
          }
          configs[p] = callback(attributes[attrName], [node, isNew, context, tagIndex])
          continue
        }

        // hookins
        var data = {
          key: attrName,
          value: attributes[attrName],
          node: node
        }
        mag.hook('attributes', attrName, data);

        //   // change
        if (data.change) {
          attrName = data.key
          attributes[attrName] = data.value
        }

        // cache atrtibutes and compare
        if (cached[getUid(node)] && cached[getUid(node)][attrName] == attributes[attrName]) continue;

        if (attributes[attrName] === null) {
          // remove property too or just attribute?
          node.removeAttribute(attrName)
        } else {

          // separate property vs attribute?
          if (attrName in node) {
            if (attrName == 'style') node[attrName].cssText = attributes[attrName]
            else node[attrName] = attributes[attrName];
          } else {
            node.setAttribute(attrName, String(attributes[attrName]));
          }
        }
        cached[getUid(node)][attrName] = attributes[attrName];
      }
    }

    // set html after setting text because html overrides text
    setText(node, attributes.text)
    setHtml(node, attributes.html)
  }


  function setText(node, text) {

    // make sure that we have a node and text to insert
    if (!node || text == null || isCached(node, text)) {
      return;
    }

    var val = String(text);



    // SELECT|INPUT|TEXTAREA
    // now add the text
    if (node.nodeName === 'INPUT') {
      // special case for input elements
      if (~['radio', 'checkbox'].indexOf(node.type)) {
        //might be in a group		
        // search fill.id for name	
        //TODO: should be only within parent node in DATA path NOT root ID
        if (node.name) {
          var items = mag.getNode(fill.id).querySelectorAll('[name=' + node.name + ']');
          if (items.length > 1) {
            // select item with matching value		
            for (var item of items) {
              if (item.value == val) {
                item.checked = true;
                break;
              }
            }
          }
        }
      } else {
        // var start=-1, end=-1;
        // if (~node.type.indexOf(['text', 'search', 'password', 'tel', 'url'])) {
        //   start = node.selectionStart;
        //   end = node.selectionEnd;
        // }

        //&& mag.doc.activeElement !=node ?
        if (val != node.value) node.value = val;
        //reset selection cursor from dynamic changes if diff & allowed type
        //if(~start) node.setSelectionRange(start, end);
      }
    } else if (node.nodeName !== 'SELECT') {
      // create a new text node and stuff in the value
      if (node.firstChild) {
        node.firstChild.textContent = val;
      } else {
        node.appendChild(node.ownerDocument.createTextNode(val));
      }

    }

    if (node.nodeName === 'SELECT' && val) {
      node.value = val;
    }

  }


  function setHtml(node, html) {
    if (!node || html == null || isCached(node, html)) return;
    node.innerHTML = html
  };


  //===========================================================================
  // TODO: Decide if the caching of element matching should be reintroduced.
  // The original implementation cached the lookup of elements, but it seems
  // like this will only be useful in cases where the same DOM elements are
  // getting filled mutliple times -- that seems like it would only happen
  // when someone is running performance benchmarks.
  //===========================================================================


  function matchingElements(node, key, nested) {
    var elements = childElements(node)
    var matches = []
    var keyName = key

    // is this cache necessary good useful?
    // are we losing some dynamism?


    var globalSearch = key[0] === '$'

    if (keyName[0] === '$') {
      // bust cache
      keyName = keyName.substr(1)
    }

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
      // TODO: mag.hookin for not found matchers
      var data = {
        key: key,
        value: matches,
        node: node
      }
      mag.hook('elementMatcher', key, data)
        //hookin change
      if (data.change) {
        // TODO: return a custom element for unmatched one ?
        matches = data.value
      }
    }
    return matches

  }

  function notIsolate(node) {
    return !mag.utils.items.isItem(node.id);
  }


  // return just the child nodes that are elements
  function childElements(node) {
    var elements = []
    if (node) {
      var children = node.childNodes
      if (children) {
        for (var i = 0; i < children.length; i += 1) {
          if (mag.utils.isHTMLEle(children[i]) && notIsolate(children[i])) {
            elements.push(children[i])
          }
        }
      }
    }
    return elements
  }

  // match elements on tag, id, name, class name, data-bind, etc.
  function elementMatcher(element, key) {
    var paddedClass = ' ' + element.className + ' ';

    return (
      element.id === key ||
      ~paddedClass.indexOf(' ' + key + ' ') ||
      element.name === key ||
      element.nodeName.toLowerCase() === key.toLowerCase() ||
      element.getAttribute('data-bind') === key
    );
  }

  fill.removeNode = removeNode;
  fill.configs = configs
  fill.find = matchingElements
  fill.setId = function(id) {
    fill.id = id
  }
  fill.clearCache = function(id) {
    if (dataCache[id]) delete dataCache[id]
  }

  mag.fill = fill;

}(mag, []));
