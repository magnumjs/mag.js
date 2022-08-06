import {MAGNUM, doc, _cprops} from '../constants';
import getNode from '../dom/getNode';
import {
  isArray,
  isHTMLEle,
  isString,
  isFunction,
  isObject,
  isFragment
} from '../utils/common';

export const configs = [];
export const cached = [];
export const MAGNUM_KEY = '_key';
export const xpathCache = [];
export const dataCache = [];
export const templates = {};

let microDraw;
export const getMicroDraw = () => microDraw;
export const setMicroDraw = _microDraw => (microDraw = _microDraw);

let hook;
export const getHook = () => hook;
export const setHook = _hook => (hook = _hook);

let checkForMod = () => {};
export const getCheckForMod = () => checkForMod;
export const setCheckForMod = _checkForMod => (checkForMod = _checkForMod);

let removeNodeModule;
export const getRemoveNodeModule = () => removeNodeModule;
export const setRemoveNodeModule = _removeNodeModule =>
  (removeNodeModule = _removeNodeModule);

let id;
export const getId = () => id;
export const setId = _id => (id = _id);

let items;
export const setItems = _items => (items = _items);
export const getItems = () => items;

let mod;
export const setMod = _mod => (mod = _mod);
export const getMod = () => mod;

let draw;
export const setDraw = _draw => (draw = _draw);
export const getDraw = () => draw;

let inc = 0;

export const clearCache = id => {
  if (dataCache[id]) delete dataCache[id];
};

export function getUid(element, clear) {
  element[MAGNUM] = element[MAGNUM] || {};
  if (!element[MAGNUM].uid || clear) element[MAGNUM].uid = ++inc;
  return element[MAGNUM].uid;
}

export function getPathTo(element, clear) {
  //add UID if does not exists
  var uid = getUid(element);
  if (xpathCache[uid] && !clear) return xpathCache[uid];
  return (xpathCache[uid] = getPathTo2(element));
}

export function getChildrenIndex(node) {
  var i = 1;
  while ((node = node.previousElementSibling)) {
    ++i;
  }
  return i;
}

const getCurrentID = () => {
  var nodeId = getId();
  if (isHTMLEle(nodeId)) {
    nodeId = nodeId[MAGNUM].scid;
  }
  return nodeId;
};

export function isCached(element, data, dataID) {
  //add UID if does not exist
  var uid = getUid(element);
  if (dataID) uid = dataID + uid;
  var nodeId = getCurrentID();
  dataCache[nodeId] = dataCache[nodeId] || [];

  if (dataCache[nodeId][uid] && dataCache[nodeId][uid] == data) return 1;
  else dataCache[nodeId][uid] = data;
}

export function findClosestId(node) {
  if (items && node.id && items.isItem(node.id)) return node;
  if (node.parentNode) return findClosestId(node.parentNode);
}

export function getPathTo4(node, scid) {
  //TODO: stateless parents? scid?
  if (node[MAGNUM] && node[MAGNUM].scid && !node[MAGNUM].pscid) {
    scid = node;
    //stateless parent
  } else if (scid) {
    return scid;
  }
  if (node.parentNode) return getPathTo4(node.parentNode, scid);
}

export function getPathTo3(element) {
  var str = '',
    par = findClosestId(element),
    ix = getChildrenIndex(element);

  if (par) {
    str += 'id("' + (par.id || par.tagName) + '")';
  }
  str += '/' + element.tagName + '[' + ix + ']';
  return str;
}

export function getPathTo2(element, cached) {
  if ((element.id && getId() === element.id) || getId() === element)
    return 'id("' + (element.id || element.tagName) + '")';
  if (element === doc.body) return element.tagName;

  var ix = 0;
  if (!element.parentNode) return;
  var siblings = element.parentNode.childNodes;
  for (var i = 0, size = siblings.length; i < size; i++) {
    var sibling = siblings[i];
    if (sibling === element)
      return (
        getPathTo2(element.parentNode) +
        (element.tagName ? '/' + element.tagName + '[' + (ix + 1) + ']' : '')
      );
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

export function removeNode(node) {
  var p = getPathTo2(node);
  // call config unload if any ?
  if (
    node &&
    cached[p + '-config'] &&
    cached[p + '-config'].configContext &&
    isFunction(cached[p + '-config'].configContext.onunload)
  ) {
    // what arg to send ?
    cached[p + '-config'].configContext.onunload(
      cached[p + '-config'].configContext,
      node,
      p
    );
    // remove self when done?
    delete cached[p + '-config'];
    delete configs[p];
  }

  if (removeNodeModule) {
    removeNodeModule(node);
  }

  if (
    node.parentNode[MAGNUM] &&
    node.parentNode[MAGNUM].children &&
    node[MAGNUM]
  ) {
    var index = node.parentNode[MAGNUM].children.indexOf(node[MAGNUM].scid);
    node.parentNode[MAGNUM].children.splice(index, 1);

    clearCache(getCurrentID());
  }

  //TODO: remove cache of all children too
  node.parentNode && node.parentNode.removeChild(node);

  //remove 'view' cache due to dom change ? recursion
  // mod.cached[items.getItem(getId())] = 0;
}

// TODO: get index from getPathTo function
export function getPathIndex(p) {
  var s =
    p &&
    parseInt(
      p
        .split('[')
        .pop()
        .slice(0, -1)
    );
  if (!s) return 0;
  return parseInt(s) - 1;
}

export function getFullPathIndex(p) {
  // return p.match(/[^[\]]+(?=])/g).join('.')
  var words = [];
  p.replace(/\[(.+?)\]/g, function($0, $1) {
    words.push($1);
  });
  return words;
}

export function getPathId(p) {
  //id("mathdemo3")
  return p && ~p.indexOf('id(') && p.split('id("')[1].split('")')[0];
}

const fhCache = [];

export function getPath(node, i, key) {
  var uid = getUid(node);
  if (xpathCache[uid]) return xpathCache[uid];
  if (fhCache[uid]) return fhCache[uid];

  // var idx = getChildrenIndex(node)
  var num = +key === +key ? i + key : i;
  var name = isObject(getId()) ? getId().tagName : getId();
  var extr = isString(key) ? key.split(')')[1] + '/' : '/';
  var p = 'id("' + name + '")' + extr + node.tagName + '[' + num + ']';

  return (fhCache[uid] = node[MAGNUM].xpath = p);
}

export function findParentChild(node) {
  if (node && node[MAGNUM] && node[MAGNUM].isItem) {
    return node;
  } else if (node.parentNode) {
    // continue to walk up parent tree
    return findParentChild(node.parentNode);
  }
}

export function replaceNode(node, replace, k) {
  if (
    !replace ||
    (node.childNodes[k] && node.childNodes[k].isEqualNode(replace))
  )
    return;

  const children = nodeListToArray(node.childNodes);
  for (let i = 0, size = children.length; i < size; i++) {
    if (children[i]) node.removeChild(children[i]);
  }

  if (node.childNodes[k]) node.replaceChild(replace, node.childNodes[k]);
  else node.appendChild(replace);
}

export function setHtml(node, html) {
  if (isArray(html)) {
    //Assuming same length?
    for (var k in html) {
      replaceNode(node, html[k], k);
    }

    return;
  } else if (isHTMLEle(html) || (isFragment(html) && !isCached(node, html))) {
    if (html[MAGNUM] && html[MAGNUM].scid && !_cprops[html[MAGNUM].scid]) {
      const clone = node.cloneNode(1);
      clone[MAGNUM] = {
        childof: html[MAGNUM].scid
      };
      _cprops[html[MAGNUM].scid] = clone;
    }

    replaceNode(node, html, 0);
    return;
  }

  if (!node || html == null || isCached(node, html)) return;

  node.innerHTML = html;
}

export // freeze the NodeList into a real Array so it can't update as DOM changes
function nodeListToArray(nodeList) {
  var temp;

  // wrap single item into an array for iteration
  // NOTE: can't use _isArray here, because it could be a NodeList (array-ish)
  if (nodeList.length == null) {
    nodeList = [nodeList];
  }

  // convert array-like object into a real array
  if (!isArray(nodeList)) {
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

export function setText(node, text) {
  // make sure that we have a node and text to insert
  if (
    !node ||
    text == null ||
    //TODO: Fix
    isCached(node, text)
  ) {
    return;
  }

  var val = String(text);

  // SELECT|INPUT|TEXTAREA
  // now add the text
  if (node.nodeName === 'INPUT') {
    // special case for input elements
    if (~['radio', 'checkbox'].indexOf(node.type)) {
      //might be in a group
      // search getId() for name
      //TODO: should be only within parent node in DATA path NOT root ID
      if (node.name) {
        //GET container:
        var parent;
        if (isHTMLEle(getId())) {
          parent = getId();
        } else parent = getNode(getId());

        var items = parent.querySelectorAll('[name=' + node.name + ']');
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

      //&& doc.activeElement !=node ?
      if (val != node.value) node.value = val;
      //reset selection cursor from dynamic changes if diff & allowed type
      //if(~start) node.setSelectionRange(start, end);
    }
  } else if (node.nodeName !== 'SELECT') {
    const nodes = nodeListToArray(node.childNodes);

    var isAtRoot = isAtRootOfComp(node);

    if (!isRootFragment(node)) {
      nodes.forEach(item => {
        if (item.nodeType != 3 || isAtRoot) {
          removeNode(item);
        }
      });
    }

    if (node.firstChild) {
      node.firstChild.textContent = val;
    } else {
      node.appendChild(node.ownerDocument.createTextNode(val));
    }
    //remove all children first?
    // while (node.lastChild) {
    //     removeNode(node.lastChild);
    // }

    // create a new text node and stuff in the value
    // node.appendChild(node.ownerDocument.createTextNode(val))
  }

  if (node.nodeName === 'SELECT' && val) {
    //TODO: array of things for "multiple" select
    node.value = val;
  }
}

const isRootFragment = node => {
  //Compare to active Comp?
  //getId() if isHTMLEle get scid to compare
  const MAGGER = node[MAGNUM];
  if (MAGGER && MAGGER.scid && node.tagName == 'FRAGMENT') {
    return 1;
  }
};
const isAtRootOfComp = node => {
  var parent = node.parentNode;
  return parent && parent[MAGNUM] && parent[MAGNUM].scid;
};
