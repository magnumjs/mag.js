var domElement = {}

domElement.remove = function(id) {
  return (elem = document.getElementById(id)).parentNode.removeChild(elem);
}
domElement.val = function(doc, key, data) {
  var eles = domElement.findByKey(doc, key)

  for (var i = 0; i < eles.length; i++) {
    var ele = eles[i].item(doc)
    if (["INPUT", "TEXTAREA", 'SELECT'].indexOf(ele.tagName) !== -1) {
      ele.value = data
    } else {
      txt = document.createTextNode(data);
      ele.innerText = txt.textContent;
    }
  }
}

domElement.setAttrs = function(doc, key, attrs) {
  var eles = domElement.findByKey(doc, key)
  for (var attr in attrs) {
    for (var i = 0; i < eles.length; i++) {
      if (attr.indexOf('on') != 0) {
        eles[i].item(doc).setAttribute(attr, attrs[attr])
      }
    }
  }
}

domElement.event = function(doc, key, vdom) {
  var eles = domElement.findByKey(doc, key)
  var attrs = vdom().attrs
  for (var event in attrs) {
    if (event.indexOf('on') == 0) {
      for (var i = 0; i < eles.length; i++) {
        eles[i].item(doc).addEventListener(event.substr(2), attrs[event])
      }
    }
  }

}

domElement.replaceWithin = function(frag, key, val) {

  this.pattern = this.pattern || new RegExp('\\[\\[(.*?)\\]\\]', 'g');

  recur(frag, this.pattern, key);

  function recur(frag, pattern, key) {
    if (frag.hasChildNodes()) {
      var list = frag.children;
      for (var i = 0, len = list.length; i < len; i++) {
        if (!list[i].firstChild) {
          continue;
        } else if (!list[i].firstChild.nodeValue) {
          recur(list[i], pattern, key);
        } else {
          replaceAttribute(pattern, list[i], key);
          replaceValue(pattern, list[i], key);
        }
      }
    } else {
      replaceAttribute(pattern, frag, key);
      replaceValue(pattern, frag, key);
    }
  }

  function replaceAttribute(pattern, el, key) {
    for (var i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
      var attr = attrs.item(i);
      replace(attr, pattern, key);
    }

    function replace(attr, pattern, key) {
      attr.nodeValue = attr.nodeValue.replace(pattern, function(out, inn, pos) {
        if (key == inn) {
          return val
        } else {
          return out;
        }
      });
    }
  }

  function replaceValue(pattern, ele, key) {
    ele.firstChild.nodeValue = ele.firstChild.nodeValue.replace(pattern, function(out, inn, pos) {
      if (key == inn) {
        return val
      } else {
        return out;
      }
    });
  }
}

domElement.setTextContent = function(element, text) {
  while (element.firstChild)
    element.removeChild(element.firstChild); // remove all existing content
  element.appendChild(document.createTextNode(text));
}

domElement.findByKey = function(doc, key) {
  var selectorMap = ['.key', '#key', 'key', '[name="key"]', '[data-bind="key"]']

  setSelectorMapKey = function(key) {
    return selectorMap.join(',').replace(/KEY/gi, key).split(',')
  }

  getElement = function(doc, selector) {
    return doc.querySelectorAll(selector)
  }

  var map = setSelectorMapKey(key)
  var eles = []
  for (var index in map) {
    var selector = map[index]
    var element
    if ((element = getElement(doc, selector)) && element.length > 0) {
      // element.directive = data
      element.selector = selector
      eles.push(element)
    }
  }
  return eles
}

domElement.hasClass = function(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

domElement.replaceClass = function(node, remove) {

  var newClassName = "";
  var i;
  var classes = node.className.split(" ");

  for (i = 0; i < classes.length; i++) {
    if (classes[i] !== remove) {
      newClassName += classes[i] + " ";
    }
  }
  node.className = newClassName;
}
