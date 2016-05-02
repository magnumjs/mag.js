/*
JSONML2 utilities
toJsonml converts a html-parser html string object into jsonml
toHtml (String)
toDom (DOM)
2016 (c) Michael GLazer GPL
*/
var jsonml = jsonml || {};

var toJsonml = function(obj) {
  //tagName, attributes, children
  var a = []
  for (var i in obj) {
    var item = obj[i];
    var tag = item.tagName;
    var attrs = item.attributes;
    var attrsSize = attrs && Object.keys(attrs).length > 0;
    var childs = item.children;
    var type = item.type.toLowerCase();
    a[0] = tag;
    if (attrsSize) a[1] = attrs;
    if (type == 'text' && attrsSize === 0) a[1] = item.content;
    if (type == 'text' && attrsSize > 0) a[2] = item.content;
    if (childs && childs.length > 0) {
      for (var k in childs) {
        var sitem = childs[k]
        if (!sitem.tagName) {
          a[a.length] = sitem.content;
        } else {
          a[a.length] = toJsonml([childs[k]]);
        }
      }
    }
  }
  return a;
}


function convertObject(obj) {
  if (typeof obj !== 'object') return obj;
  var s = '';
  for (var k in obj) {
    s += k + ": " + obj[k] + ";";
  }
  return s;
}

function makeAttrs(ats) {
  var s = ''
  for (var k in ats) {
    s += k + '="' + convertObject(ats[k]) + '" '
  }
  return s && s.trim();
}

jsonml.toHtml = function(vdom) {
  // [0] = tag || text, [1] if object == attrs, [0], [1], [2] if array equal children

  if (typeof vdom == 'string') {
    return String(vdom);
  }
  var s = '',
    tag, attrs, children;
  var type1 = typeof vdom[0],
    type2 = typeof vdom[1],
    type3 = typeof vdom[2];

  if (type1 == 'string') {
    tag = vdom[0]
  }
  if (!Array.isArray(vdom[1]) && type2 !== 'string') {
    attrs = makeAttrs(vdom[1]);
  } else if (type2 == 'string') {
    children = vdom[1];
  }

  // get all child siblings
  if (Array.isArray(vdom[1])) {
    children = vdom.splice(1, vdom.length);
  }
  if (Array.isArray(vdom[2])) {
    children = vdom.splice(2, vdom.length);
  }


  if (tag) {
    s += '<' + tag.toLowerCase() + (attrs ? ' ' + attrs : '') + '>';
  }
  if (children) {
    for (var i = 0, size = children.length; i < size; i++) {
      var c = jsonml.toHtml(children[i]);
      s += c;
    }
  }
  if (tag) {
    s += '</' + tag.toLowerCase() + '>';
  }
  return s;
};

jsonml.toDom = function(ar /*array*/ , p /* parent */ ,
  f /* function to call on creation of each node */ ) {
  var self = ar;
  if (!p) p = document.createDocumentFragment();

  if (typeof self[0] === 'string') {
    // create element
    var d = document,
      el = d.createElement(self[0]);

    // resolve parent
    p = (typeof p === 'string') ? d.getElementById(p) : p;

    // a list of attributes to map or 'set directly'
    var am = {
      id: "id",
      "class": "className",
      rowspan: "rowSpan",
      colspan: "colSpan",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      maxlength: "maxLength",
      readonly: "readOnly",
      contenteditable: "contentEditable"
    };

    // add attributes
    if (self[1] && self[1].constructor == Object) {
      var n = self[1];

      for (var a in self[1]) {
        if (typeof self[a] != 'function') {
          if (a === "style" && typeof el.style.cssText != "undefined") {
            el.style.cssText = n[a];
          } else if (a === "style") {
            el.style = n[a];
          } else if (am[a]) {
            el[am[a]] = n[a];
          } else if (typeof self[a] != "string") {
            el[a] =
              n[a];
          } // not a string, set directly (expando)
          else {
            el.setAttribute(a, n[a]);
            alert(a);
          }
        }
      }
    }

    // insert element (must be inserted before function call, 
    // otherwise .parentNode does not exist)
    if (p) {
      p.appendChild(el);
    }

    // pass each node to a function (attributes will exist, 
    // but not innerText||children. can be used for adding events, etc.)
    if (typeof f === 'function') {
      f.apply(el);
    }

    for (var i = 1, l = self.length; i < l; i++) {
      var n = self[i],
        c = n.constructor;

      if (c === String) // add text node
      {
        el.appendChild(d.createTextNode(n));
      } else if (c === Array) // add children
      {
        jsonml.toDom(n, el, f);
      }
    }

    return el;
  }

  return null;
};
