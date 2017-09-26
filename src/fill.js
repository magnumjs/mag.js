/*
MagJS v0.29.7
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
    var uid = getUid(element)
    if (xpathCache[uid] && !clear) return xpathCache[uid]
    return xpathCache[uid] = getPathTo2(element)
  }


  function getChildrenIndex(node) {
    var i = 1;
    while (node = node.previousElementSibling) {
      ++i;
    }
    return i;
  }

  function isCached(element, data) {
    //add UID if does not exist
    var uid = getUid(element)
    dataCache[fill.id] = dataCache[fill.id] || []
    if (dataCache[fill.id][uid] && dataCache[fill.id][uid] == data) return 1
    else dataCache[fill.id][uid] = data
  }

  function findClosestId(node) {
    if (node.id && mag.utils.items.isItem(node.id)) return node
    if (node.parentNode) return findClosestId(node.parentNode)
  }

  function getPathTo4(node, scid) {
    //TODO: stateless parents? scid?
    if (node[MAGNUM] && node[MAGNUM].scid && !node[MAGNUM].pscid) {
      scid = node;
      //stateless parent
    } else if (scid) {
      return scid
    }
    if (node.parentNode) return getPathTo4(node.parentNode, scid)
  }

  function getPathTo3(element) {
    var str = '',
      par = findClosestId(element),
      ix = getChildrenIndex(element);

    if (par) {
      str += 'id("' + (par.id || par.tagName) + '")';
    }
    str += '/' + element.tagName + '[' + ix + ']';
    return str;
  }

  function getPathTo2(element, cached) {
    if ((element.id && fill.id === element.id) || fill.id === element)
      return 'id("' + (element.id || element.tagName) + '")';
    if (element === mag.doc.body)
      return element.tagName;

    var ix = 0;
    if (!element.parentNode) return
    var siblings = element.parentNode.childNodes;
    for (var i = 0, size = siblings.length; i < size; i++) {
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

    removeNodeModule(node)

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

  function getFullPathIndex(p) {
    // return p.match(/[^[\]]+(?=])/g).join('.')
    var words = []
    p.replace(/\[(.+?)\]/g, function($0, $1) {
      words.push($1)
    })
    return words;
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

      var fragment = mag.doc.createDocumentFragment();

      //Adding
      var ii = 0;
      while (elements.length < data.length) {
        if (templates[key]) {
          parent.insertAdjacentHTML("beforeend", templates[key].node)
          node = parent.lastChild
        } else {
          node = elements[0].cloneNode(1)
        }

        getPath(node, ++ii, key)

        elements.push(node)
        fragment.appendChild(node)
      }
      parent.appendChild(fragment)
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
          fill.run(elements[i], data[i], i)
        }
      } else {
        var p = getPath(elements[i], (i + 1), key)
          // var p = getPathTo(elements[i])

        if (data && typeof data == "object" && data.hasOwnProperty(MAGNUM_KEY) && !mag.utils.isHTMLEle(data)) {

          elements[i][MAGNUM].isItem = true
          elements[i][MAGNUM].dataPass = data
        }
        fillNode(elements[i], data, p, key)
      }

    }
  }
  var fhCache = [];

  function getPath(node, i, key) {
    var uid = getUid(node)
    if (xpathCache[uid]) return xpathCache[uid]
    if (fhCache[uid]) return fhCache[uid]

    // var idx = getChildrenIndex(node)
    var num = +key === +key ? i + key : i
    var name = (typeof fill.id == 'object' ? fill.id.tagName : fill.id);
    var extr = typeof key == 'string' ? key.split(')')[1] + '/' : '/'
    var p = 'id("' + name + '")' + extr + node.tagName + '[' + num + ']'

    return fhCache[uid] = node[MAGNUM].xpath = p;
  }

  function findParentChild(node) {
    if (node && node[MAGNUM] && node[MAGNUM].isItem) {
      return node
    } else if (node.parentNode) {
      // continue to walk up parent tree 
      return findParentChild(node.parentNode)
    }
  }

  function addToNode(node, val) {

    //TODO: finer grain diffing, attach once
    if (isCached(node, val.outerHTML)) {
      return;
    }

    if ((!val.id && !node.childNodes[0]) || (val.id && !mag.doc.getElementById(val.id)) || (node.firstChild && !node.firstChild.isEqualNode(val))) {
      // take children and add to properties
      var index = mag.utils.items.getItem(val.id);
      if (~index && node.hasChildNodes()) {
        var pindex = mag.utils.items.getItem(fill.id);
        var clone = node.cloneNode(1);
        clone[MAGNUM] = {
          'childof': pindex
        }
        mag.mod.getProps(index).children = clone;
        //redraw?
        mag.redraw(val, index)
      } else if (val[MAGNUM] && val[MAGNUM].scid) {
        clone = node.cloneNode(1);
        clone[MAGNUM] = {
          'childof': val[MAGNUM].scid
        }
        mag._cprops[val[MAGNUM].scid] = clone;
      }

      //remove, replace?
      //Remove children, call UNLOADERS?
      while (node.lastChild) {
        // removeNodeModule(node.lastChild)
        // node.removeChild(node.lastChild)
        removeNode(node.lastChild)
      }

      //TODO: Call configs when adding?

      if (val[MAGNUM] && val[MAGNUM]['childof'] !== undefined) {
        node.innerHTML = val.innerHTML;

        var cid = val[MAGNUM]['childof'];

        //Not stateless
        if (!mag._cprops[cid]) {
          microDraw(node, cid)

          //subscribe once to the parent to notify the child of changes to the state
          //only once?
          mag.utils.onLCEvent('willupdate', cid, () => {
            microDraw(node, cid)
          });
        }

      } else {
        node.appendChild(val);
      }
    }
  }

  function removeNodeModule(node) {
    //inner mods too?
    var instanceId = mag.utils.items.getItem(node.id)
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        removeNodeModule(node.children[i])
      }
    }
    if (~instanceId) {
      mag.utils.callLCEvent('onunload', mag.mod.getState(instanceId), node, instanceId)
      mag.mod.clear(instanceId)
      mag.mod.remove(instanceId)
      mag.fill.clearCache(mag.mod.getId(instanceId))
    }
  }

  function microDraw(node, cid) {
    var pfillId = fill.id
    fill.setId(mag.mod.getId(cid))
    fill.run(node, mag.mod.getState(cid))
    fill.setId(pfillId)
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

        //TODO: what's this use case??
        // if (_isArray(value)) {
        //   elements = matchingElements(node, '$' + key);
        // }

        fill.run(elements, value, p + '/' + key);
      }
    }
  }


  var functionHandler = function(data, node, tagIndex, p) {
    p = getPathTo(node)

    tagIndex = getFullPathIndex(p);

    var val = data(tagIndex.join('.'), p)
    if (val && mag.utils.isHTMLEle(val)) {
      // remove childs first
      addToNode(node, val);

      node[MAGNUM] = node[MAGNUM] || {}
      node[MAGNUM].isItem = true
      node[MAGNUM].dataPass = {
        index: tagIndex
      }

      data.draw && data.draw();
    } else {

      // TODO: is this a valid use case?

      // var type = /<[a-z][\s\S]*>/i.test(val) ? '_html' : '_text'
      // var obj = {}
      // obj[type] = val
      return fillNode(node, val, p)
    }

  }

  function fillNode(node, data, p, key) {
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
      fillAttributes(node, attributes, p, key)
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

  function createEventCall(node, fun) {

    var eventCall = function(fun, node, e) {

      //TODO: why not cache xpath?
      var xpath = getPathTo3(node);
      var id = getPathId(xpath)

      if (!id) {
        id = getPathTo4(node);
      }

      var pfillId = fill.id;
      fill.setId(id)

      var dataParent = findParentChild(node),
        path = dataParent && getPathTo2(dataParent),
        parentIndex = getPathIndex(path),
        xpath = xpath,
        tagIndex = getPathIndex(xpath),
        parent = {
          path: path,
          node: dataParent,
          data: ((dataParent || {})[MAGNUM] || []).dataPass,
          index: parentIndex
        }
      fill.setId(pfillId)
      var nodee = mag.doc.getElementById(id)
      var instanceId = mag.utils.items.getItem(id);

      // What if ret is a promise?
      var ret = fun.call(~instanceId ? mag.mod.getMod(instanceId) : nodee, e, tagIndex, node, parent)
      if (id && nodee) {
        var redraw = function() {
          mag.redraw(nodee, instanceId, 1)
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
    }.bind({}, fun, node)

    return eventCall;
  }


  //Dynamic listeners without event delegation
  function attachEvent(node, eventName) {
    function event(e) {
      var handlers = node[MAGNUM]['eventHandlers'][eventName];
      //get all uniue node specific events and run them
      for (var path in handlers) {
        var fun = handlers[path];
        var hand = createEventCall(node, fun)
        var ret = hand(e)
        if (ret === false) e.preventDefault();
      }
    }
    node.removeEventListener(eventName, event);
    node.addEventListener(eventName, event);
  }


  function makeEvent(event, attrName, node, parentKey) {
    var eventName = attrName.substr(2).toLowerCase();

    var uid = (typeof parentKey == 'string' ? parentKey.split('/')[0] : '') + '-' + node[MAGNUM].uid;
    var events = node[MAGNUM].events = node[MAGNUM].events || []
    var eventHandlers = node[MAGNUM].eventHandlers = node[MAGNUM].eventHandlers || []
    eventHandlers[eventName] = eventHandlers[eventName] || []
    eventHandlers[eventName][uid] = event;

    if (!events[eventName]) {
      events[eventName] = 1
      attachEvent(node, eventName)
    }
  }
  // fill in the attributes on an element (setting text and html first)
  function fillAttributes(node, attributes, p, parentKey) {
    var tagIndex = getPathIndex(p);

    cached[getUid(node)] = cached[getUid(node)] || [];

    // set the rest of the attributes
    for (var attrName in attributes) {

      // skip text and html, they've already been set
      if (attrName === 'text' || attrName === 'html') continue


      // events
      if (attrName.indexOf('on') == 0) {
        makeEvent(attributes[attrName], attrName, node, parentKey)
          // node[attrName.toLowerCase()] = createEventCall(node, attributes[attrName], attrName)

      } else {

        if (attrName == 'config') {
          //TODO: Why not cache xpath?
          var p = getPathTo(node),
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
          if (attrName == 'value' && node.multiple && node.selectedOptions && Array.isArray(attributes[attrName])) {
            //TODO: case multiple select
            node.value = attributes[attrName]

            attributes[attrName].forEach(function(v) {
              Array.from(node.options).find(c => c.value == v).selected = true;
            })
          }
          // separate property vs attribute?
          else if (attrName in node) {
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
      //TODO: array of things for "multiple" select
      node.value = val;
    }

  }


  function replaceNode(node, replace, k) {
    if (!replace || (node.childNodes[k] && node.childNodes[k].isEqualNode(replace))) return;
    if (node.childNodes[k]) node.replaceChild(replace, node.childNodes[k])
    else node.appendChild(replace)
  }

  function setHtml(node, html) {

    if (Array.isArray(html)) {
      //Assuming same length?
      for (var k in html) {
        replaceNode(node, html[k], k)
      }

      return;
    } else if (mag.utils.isHTMLEle(html)) {
      replaceNode(node, html, 0)
      return
    }

    if (!node || html == null || isCached(node, html)) return;

    node.innerHTML = html
  }


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


  function isInIsolate(node) {
    if (
      fill.id && (
        (mag.utils.isHTMLEle(fill.id) && node[MAGNUM] && node[MAGNUM].scid) //Stateless
        || (node.id && node.id != fill.id && mag.utils.items.isItem(node.id))
      )
    ) {
      return 0;
    } else {
      return 1;
    }
  }


  // return just the child nodes that are elements
  function childElements(node) {
    var elements = []
    if (node) {
      var children = node.childNodes
      if (children) {
        for (var i = 0; i < children.length; i += 1) {

          if (children[i].nodeType === 1 && isInIsolate(children[i])) {
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
  // fill.getPathTo = getPathTo
  fill.removeNode = removeNode;
  fill.configs = configs
  fill.find = matchingElements
  fill.setId = (id) => {
    fill.id = id
  }
  fill.clearCache = (id) => {
    if (dataCache[id]) delete dataCache[id]
  }

  mag.fill = fill;

}(mag, []));
