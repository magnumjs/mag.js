;
(function(mag, configs, document, undefined) {

  "use strict";

  var ELEMENT_NODE = 1,
    cached = [],
    MAGNUM = '__magnum__',
    FUNCTION = 'function',
    UNDEFINED = 'undefined',
    MAGNUM_KEY = '_key',
    ignorekeys = ['willupdate', 'didupdate', 'didload', 'willload', 'isupdate'];

  // helper method to detect arrays -- silly javascript
  function _isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }


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
    // console.log('read inside removeNode')
    var p = getPathTo(node)
      // remove cache of all children too

    node.parentNode.removeChild(node)
      // call config unload if any ?

    //console.log(p, cached[p])
    if (cached[p + '-config'] && cached[p + '-config'].configContext && typeof cached[p + '-config'].configContext.onunload === FUNCTION) {
      // what arg to send ?
      cached[p + '-config'].configContext.onunload(cached[p + '-config'].configContext, node, p)
    }
  }

  // TODO: get index from getPathTo function
  function getPathIndex(p) {

    var s = p && parseInt(p.split('[').pop().slice(0, -1))

    if (!s) return 0
    return parseInt(s) - 1
  }


  var templates = {},
    gkeys = {} // What about nested Lists, which guid?
    //firstRun = false;

  // this is the entry point for this module, to fill the dom with data
  function fill(nodeList, data, key) {
    var node, parent, dataIsArray



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
        // should never reach here
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

      //Adding
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
      // loop thru to make sure no undefined keys



      var ekeys = elements.map(function(i) {
        return i.__key
      })

      var keys = data.map(function(i) {
        return i[MAGNUM_KEY]
      })


      // add keys if equal
      if (elements.length == data.length || keys.indexOf(undefined) !== -1) {


        // changes data can cause recursion!

        var data = data.map(function(d, i) {

            if (typeof d === 'object') {
              if (elements[i].__key && typeof d[MAGNUM_KEY] === UNDEFINED) {
                d[MAGNUM_KEY] = elements[i].__key
                return d
              }
              if (typeof d[MAGNUM_KEY] === UNDEFINED) {
                d[MAGNUM_KEY] = MAGNUM + i
                  //d[MAGNUM_KEY] = MAGNUM + gkeys[key]++
              }
              //console.log(d[MAGNUM_KEY], i)
              elements[i].__key = d[MAGNUM_KEY]
            }

            return d
          })
          //console.log(key, data)
      }
      if (elements.length > data.length) {
        if (data.length === 0 || typeof data[0] !== 'object') {

          while (elements.length > data.length) {
            node = elements.pop()
            parent = node.parentNode
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
            //console.log('m keys', m)
          var k = elements.map(function(i) {
              return i.__key
            })
            //console.log('e keys', k)

          var elements = elements.filter(function(ele, i) {
            if (m.indexOf(ele.__key) === -1 || found.indexOf(ele.__key) !== -1) {
              found.push(ele.__key)
              removeNode(ele)
              return false
            }
            found.push(ele.__key)
            return true
          })

        }
      }

    }

    // now fill each node with the data
    for (var i = 0; i < elements.length; i++) {
      //var p = getPathTo(elements[i])
      if (dataIsArray) {
        if (elements[i]) {


          fill(elements[i], data[i])

        }
      } else {
        //TODO: is this a child of an array?
        if (data && typeof data === "object" && Object.keys(data).indexOf(MAGNUM_KEY) !== -1) {
          elements[i][MAGNUM] = elements[i][MAGNUM] || {}
            //console.log(data, i)
          elements[i][MAGNUM].isChildOfArray = true
          elements[i][MAGNUM].dataPass = data
        }

        fillNode(elements[i], data, elements[i].id +i)
      }

    }
    return nodeList
  }

  function findParentChild(node) {
    if (node.parentNode && node.parentNode[MAGNUM] && node.parentNode[MAGNUM].isChildOfArray) {
      return node.parentNode
    } else if (node.parentNode) {
      // continue to walk up parent tree 
      return findParentChild(node.parentNode)
    }
  }

  function fillNode(node, data, index) {
    var attributes,
      attrValue,
      element,
      elements

    // ignore functions
    if (typeof data === FUNCTION && typeof data()._html !== FUNCTION) {
      return
    }

    if (typeof data !== 'object' && typeof data === FUNCTION && typeof data()._html === FUNCTION) return fillNode(node, {
      _html: data()._html
    }, index)


    // if the value is a simple property wrap it in the attributes hash
    if (typeof data !== 'object') return fillNode(node, {
      _text: data
    }, index)

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

      //TODO: prepend attributes ? double underscore ??

      // anything that starts with an underscore is an attribute
      if (key[0] === '_') {

        attributes = attributes || {}
        attributes[key.substr(1)] = value;

      }
    }

    //var p = getPathTo(node)

    // fill in all the attributes
    if (attributes) {


      fillAttributes(node, attributes, index)

    }

      // look for non-attribute keys and recurse into those elements
    for (var key in data) {

      // ignore certain system keys
      if (ignorekeys.indexOf(key) !== -1) continue

      var value = data[key]

      // only attributes start with an underscore
      if (key[0] !== '_') {
        elements = matchingElements(node, key);

        // function 
        if (typeof value === FUNCTION && value.type == 'fun') {
          // try {

          value = value()

          // } catch (e) {}
        }

        // if is array make sure we load all elements not just the first for existing lists

        if (_isArray(value)) {
          elements = matchingElements(node, '$' + key);
        }

        fill(elements, value, index + '/' + key);

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
  function fillAttributes(node, attributes, index) {



    // attach to topId so can be removed later

    // node._events = node._events || []

    // set the rest of the attributes
    for (var attrName in attributes) {

      // skip text and html, they've already been set
      if (attrName === 'text' || attrName === 'html') continue

      // events
      if (attrName.indexOf('on') == 0) {

        var eventCall = function(fun, node, e) {

          var dataParent = findParentChild(node),
            path = dataParent && getPathTo(dataParent),
            parentIndex = getPathIndex(path),
            xpath = getPathTo(node),
            tagIndex = getPathIndex(xpath),
            parent = {
              path: path,
              data: ((dataParent || {})[MAGNUM] || []).dataPass,
              node: dataParent,
              index: parentIndex
            }
          var ret = fun.call(node, e, tagIndex, node, parent)
            // what ret is a promise
            //if(ret.then && ret.then == FUNCTION)
          mag.redraw()
          return ret
        }.bind({}, attributes[attrName], node)

        node[attrName] = eventCall


      } else {

        if (attrName == 'config') {
          // have we been here before?
          // does the element already exist in cache
          // useful to know if this is newly added
          var isNew = true
          var p = getPathTo(node),
            tagIndex = getPathIndex(p);
          if (!cached[p + '-config']) {
            cached[p + '-config'] = {}
          } else {
            isNew = false
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

        // hookins
        var data = {
          key: attrName,
          value: attributes[attrName],
          node: node
        }
        mag.hook('attributes', attrName, data)
          // change
        if (data.change) {
          attrName = data.key
          attributes[attrName] = data.value
        }

        //if (cache) continue
        if (attributes[attrName] === null) {
          node.removeAttribute(attrName)
        } else {
          node.setAttribute(attrName, attributes[attrName].toString())
        }

      }
    }


    // set html after setting text because html overrides text
    setText(node, attributes.text)
    setHtml(node, attributes.html, index)
  }

  function setText(node, text, xpath) {
    var child, children

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
    if (node.nodeName === 'INPUT') {
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


    if (node.nodeName === 'SELECT') {
      node.value = text.toString();
    }

    // if (node.nodeName === 'SELECT') {
    //     for(var k in node.childNodes){
    //       if(node.childNodes[k].innerText){
    //         node.childNodes[k].setAttribute('value', node.childNodes[k].innerText);
    //         if(node.childNodes[k].innerText == text.toString()){
    //           node.childNodes[k].setAttribute('selected',true);
    //         }
    //       }
    //     }
    //     node.value=text.toString();
    // }
  }

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function addCloneId(html, index) {
    // change id
    if (html.cloner) {

      // check if already has
      html.id = MAGNUM + html.id.split(MAGNUM).pop() + (!endsWith(html.id, index) ? index : '')

    }
  }


  function setChildNode(parent, child, tagIndex) {
    addCloneId(child, tagIndex)

    // var sp1 = document.createElement("span")
    // parent.appendChild(sp1)
    // parent.replaceChild(child, sp1);

    if (parent.firstChild) parent.replaceChild(child, parent.firstChild)
    else parent.appendChild(child)
  }

  function setHtml(node, html, tagIndex) {

    if (!node || html == null) return;

    // var display = node.style.display || 'block';
    // node.style.display = 'none';

    // remove all children
    // while (node.firstChild) {
    //   node.removeChild(node.firstChild);
    // }

    if (typeof html === FUNCTION && html().nodeType === 1) {
      setChildNode(node, html(), tagIndex);

    } else if (html.nodeType === 1) {

      setChildNode(node, html, tagIndex);

    } else {
      node.innerHTML = html;
    }

    // node.style.display = display;

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
      //console.log('FILL - Warning: no matches found for "' + key + '"')
      var data = {
        key: key,
        value: matches,
        node: node
      }
      mag.hook('elementMatcher', key, data)
        //hookin change
      if (data.change) {
        //console.log('change to elementMatcher key - ' + key, data)
        // TODO: return a custom element for unmatched one ?
        matches = data.value
      }
    }
    return matches

  }


  // return just the child nodes that are elements
  function childElements(node) {
    var elements = []
    if (node) {
      var children = node.childNodes
      if (children) {
        for (var i = 0; i < children.length; i += 1) {
          if (children[i].nodeType === ELEMENT_NODE) {
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
      paddedClass.indexOf(' ' + key + ' ') > -1 ||
      element.name === key ||
      element.nodeName.toLowerCase() === key.toLowerCase() ||
      element.getAttribute('data-bind') === key
    );
  }

  function clear() {
    //console.log('clear called')
    //firstRun = true
    //CLEAR CACHE TOO?
    //cached=[]
  }

  function elementToObject(el, o) {

    var o = {
      tag: el.tagName
    };
    o['children'] = []
    if (el.firstChild || el.children[0]) {
      var item = el.firstChild || el.childNodes[0]
      var val = item.nodeValue || item.value || item.innerText
      if (val) val = val.replace(/\u00a0/g, "x").trim()
      if (val) o['children'].push(val)
    }

    var i = 0;
    o['attrs'] = {}
    for (i; i < el.attributes.length; i++) {
      o['attrs'][el.attributes[i].name] = el.attributes[i].value;
    }

    var children = el.children;
    if (children.length) {

      i = 0;
      for (i; i < children.length; i++) {
        var child = children[i];
        o.children.push(elementToObject(child, o.children))
      }
    }
    return o;
  }



  mag.fill = {
    fill: fill,
    elementToObject: elementToObject,
    cached: cached,
    find: matchingElements,
    // clear: clear,
    // unclear: unclear,
    configs: configs
  }
  window.mag = mag

}(window.mag || {}, [], document))
