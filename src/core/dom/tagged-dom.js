import {doc, MAGNUM} from '../constants';
import {isString, isObject, isFunction, isHTMLEle} from '../utils/common';
import mag from '../mag';
import html2dom from './html2dom';
import {makeEvent} from '../fill/events';
import isNode from './isNode';

/*
Forked from: https://raw.githubusercontent.com/kapouer/dom-template-strings/master/src/index.js
 */

let counter = 0;
function generateId() {
  counter++;
  return `p-${counter}-${Date.now()}`;
}

const getNameByTag = (tag, a) =>
  a.find(item => item.name.toLowerCase() === tag.toLowerCase());

function addChildrenAttrs(itemNode, attrNodes, funcs) {
  var inner = itemNode.innerHTML.trim();
  if (!inner) return {};

  if (attrNodes[inner]) {
    const val = attrNodes[inner];
    itemNode.innerHTML = '';
    return {children: val};
  }

  //Child as function?

  //loop thru to add props
  const frags = html2dom(itemNode.innerHTML);

  const arr = Array.from(frags.childNodes);
  arr.forEach((item, index) => {
    arr[index].props = {};

    if (item.tagName) {
      arr[index].props = addChildrenAttrs(
        itemNode.childNodes[index],
        attrNodes,
        funcs
      );
      var tag = getNameByTag(item.tagName, funcs);
      arr[index].func = getFunc(tag ? tag.name : item.tagName);
    }
    if (itemNode.childNodes[index][MAGNUM]) {
      arr[index].props = itemNode.childNodes[index][MAGNUM].props;
    } else {
      // arr[index].props = {}
      getAttrs(itemNode.childNodes[index], arr[index].props, attrNodes);
    }
  });
  return {children: arr};
}

const convertToNum = str => {
  if (!!str.trim() && !isNaN(str)) return +str;
  return str;
};

function getAttrs(itemNode, attrs, attrNodes) {
  if (itemNode.attributes) {
    for (var i = 0, size = itemNode.attributes.length; i < size; i++) {
      const attrib = itemNode.attributes[i];
      //TODO: attributes that are Nodes?
      //children?
      attrs[attrib.name] = attrNodes[attrib.value]
        ? attrNodes[attrib.value]
        : convertToNum(attrib.value);
    }
  }
}

function applyFuncs(funcs, container, attrNodes) {
  funcs.forEach(item => {
    const nodes = container.querySelectorAll(item.name.replace(/\./g, '\\.'));

    if (nodes) {
      nodes.forEach(itemNode => {
        const attrs = addChildrenAttrs(itemNode, attrNodes, funcs);
        getAttrs(itemNode, attrs, attrNodes);

        var func = getFunc(item.name);

        if (func) {
          //TODO: Auto add keys to unique instances?
          if (!attrs.key && func.props) {
            attrs.key = ++counter;
          }
          let newNode = func(attrs);

          if (!(newNode instanceof Node)) {
            newNode = dom`${newNode}`;
          }

          // loop through attrs look for onEvents for Custom Elements??
          //   if(attrs['onclick']){
          //       //attach to newNode
          //       makeEvent(attrs['onclick'], 'onclick', newNode);
          //   }

          itemNode.parentNode.replaceChild(newNode, itemNode);
        }
      });
    }
  });
}

function getElementsByText(noder, str, tag = '*') {
  return Array.from(noder.querySelectorAll(tag)).find(
    el => el.textContent === str
  );
}
// function startsWithCapital(word) {
//   return word && word.charAt(0) === word.charAt(0).toUpperCase();
// }
function applyAttrs(placeholders, container, funcs) {
  const attrNodes = {};
  // Replace placeholders with real Nodes
  placeholders.forEach(({id, node, attr}) => {
    let placeholder = container.querySelector(`#${id}`);
    if (!placeholder) {
      placeholder = container.querySelector(`${id}`);
    }

    if (!placeholder) {
      var temp = getElementsByText(container, `"${id}"`);
      var temp2 = getElementsByText(container, `${id}`);

      if (isFunction(node) && !temp) {
        const findNode = container.querySelector('[' + attr + '="' + id + '"]');

        if (findNode) {
          const tag = getNameByTag(findNode.tagName, funcs);
          // const starts = startsWithCapital(tag ? tag.name : '');
          const starts = getFunc(tag ? tag.name : findNode.tagName);

          if (attr.indexOf('on') == 0 && !starts) {
            makeEvent(node, attr, findNode, id);
            findNode.removeAttribute(attr);
          }

          findNode[MAGNUM] = findNode[MAGNUM] || {};
          findNode[MAGNUM].props = findNode[MAGNUM].props || {};
          findNode[MAGNUM].props[attr] = node;
          // findNode.removeAttribute(attr);
        }

        attrNodes[id] = node;
      } else if (temp) {
        temp.replaceChild(node, temp.childNodes[0]);
        return attrNodes;
      } else if (temp2) {
        if (node.nodeType == 3) {
          temp2.replaceChild(node, temp2.childNodes[0]);
          return attrNodes;
        } else {
          // attrNodes[id] = node;
          for (let i = 0; i < node.length; i++) {
            let item = node[i];
            temp2.replaceChild(item.parentNode, temp2.childNodes[0]);
          }
        }
        // return attrNodes;
      }
    }
    if (placeholder && isHTMLEle(node)) {
      placeholder.parentNode.replaceChild(node, placeholder);
    } else if (placeholder && isFunction(node)) {
      const attr1 = {};
      const att = getAttrs(placeholder, attr1, attrNodes);
      const newNode = node(attr1);
      placeholder.parentNode.replaceChild(dom`${newNode}`, placeholder);
    } else {
      attrNodes[id] = node;
    }
  });
  return attrNodes;
}

function generateNodes(doc, ...partials) {
  // Array of placeholder IDs
  const placeholders = [];
  const funcs = [];

  // Generate regular HTML string first
  function reducer(carry, partial) {
    if (partial && partial.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
      partial = partial.childNodes;
    } else if (isString(partial)) {
      const parts = partial.split('<');
      parts.forEach(part => {
        const first = part[0];
        if (
          first &&
          first == first.toUpperCase() &&
          first != first.toLowerCase()
        ) {
          const name = part
            .split('>')[0]
            .split(' ')[0]
            .replace(/>|\//, '')
            .trim();
          funcs.push({name});
        }
        //TODO: add quotes to attributes missing them?
      });
    }

    if (isObject(partial) && partial instanceof Node) {
      const id = generateId();
      placeholders.push({id, node: partial});
      if (~carry[0].indexOf('=') && !carry[1]) {
        //ATTR
        return carry.concat(`"${id}"`);
      } else if (partial.nodeType == 3) {
        return carry.concat(`${id}`);
      } else {
        return carry.concat(
          `<${partial.nodeName} id="${id}"></${partial.nodeName}>`
        );
      }
    } else if (isObject(partial)) {
      let last, attr;
      const id = generateId();

      if (~carry.slice(-1).indexOf('=')) {
        last = carry.concat(`"${id}"`);
      } else if (isFunction(partial) && carry.join('').includes('on')) {
        attr = carry
          .slice()
          .pop()
          .split(' ')
          .pop()
          .split('=')[0];
      }
      last = carry.concat(id);
      placeholders.push({id, node: partial, attr});
      return last;
    } else if (
      partial &&
      isFunction(partial.item) &&
      typeof partial.length == 'number'
    ) {
      return carry.concat(Array.prototype.reduce.call(partial, reducer, []));
    } else {
      return carry.concat(partial);
    }
  }
  const html = partials
    .reduce(reducer, [])
    .join('')
    .replace(/^\s*</, '<')
    .replace(/>\s*$/, '>');

  // Wrap in temporary container node
  let container = html2dom(
    `<fragment>\n${html.replace(/\>[\r\n ]+\</g, '><')}\n</fragment>`
  );

  const attrNodes = applyAttrs(placeholders, container, funcs);
  applyFuncs(funcs, container, attrNodes);

  let shouldBeFragment = false;
  for (var i = 0; i < partials.length; i++) {
    if (partials[i] == '') {
      continue;
    } else if (partials[i] instanceof Node) {
      shouldBeFragment = true;
      break;
    } else {
      break;
    }
  }

  if (container.childNodes.length == 1 && !shouldBeFragment) {
    let child = container.firstChild;
    container.removeChild(child);
    return child;
  } else {
    return container;
  }
}

var loopNames = name => {
  if (~name.indexOf('.')) {
    var found;
    name.split('.').forEach(namer => {
      found = found ? found[namer] : getFuncByName(namer);
    });
    if (found) return found;
  }
  return getFuncByName(name);
};

var getFunc = name => {
  var func = loopNames(name);
  if (func) return func;
  //TODO: throw error?
};

var getByName = name => {
  //TODO: case insensitivity, sub like window.todos.CompName
  if (_self[name] && isObject(_self[name])) return _self[name];
  if (mag[name] && isObject(mag[name])) return mag[name];
};
var getFuncByName = name => {
  var func = getByName(name);
  if (func) return func;
  //check lowercase
  return getByName(name.toLowerCase());
};

function taggedTemplateHandler(doc, strings, ...values) {
  // Create an array that puts the values back in their place
  const arr = strings.reduce((carry, current, index) => {
    return carry.concat(
      current,
      index + 1 === strings.length ? [] : values[index]
    );
  }, []);

  return generateNodes(doc, ...arr);
}

var _self;

function dom(strings, ...values) {
  _self = global || this || window;
  return taggedTemplateHandler(doc, strings, ...values);
}

export default dom;
