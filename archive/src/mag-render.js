/**
 * @name mag-render.js dom var rendering for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */
'use strict';
(function (mag, undefined) {
  var _toString = Object.prototype.toString;

  mag.render.serve = function (f) {
    // pre parse it
    // get Controller's scopeContextContainer 'name'
    // get it's element, nested controller? parent context?
    var args = f.arguments;
    var name = args[0];

    var found = mag.render.preParser(this, name);

    // don't go to next 'controller' if the container doesn't exist
    // put back into loop for rechecking ?
    if (!found) return;

    mag.aspect.next(f);
    var scope = this.getScope(name);
    var that = this;

    this.on('propertyChanged',
      mag.watch.throttle(
        function () {
          this.count = this.count + 1 || 0;
          //   console.log('parser'+this.count);
          mag.render.parse(that, name, scope);
          // mag.watch.throttle( mag.render.parse(that, name, scope));
        }
      )
    );

    this.on('propertyAccessed',
      mag.watch.throttle(
        function () {
          this.count = this.count + 1 || 0;
          //console.log('rendere'+this.count);
          mag.render.parse(that, name, scope);
          //mag.watch.throttle( mag.render.parse(that, name, scope));
        }
      )
    );

    mag.render.parse(that, name, scope);
  };

  function setTextContent(element, text) {
    while (element.firstChild !== null)
      element.removeChild(element.firstChild); // remove all existing content
    element.appendChild(document.createTextNode(text));
  }

  mag.render.preParser = function (that, name) {
    log('info', 'template parse start' + name);

    var docFragRoot = document.getElementById(name);
    that.fire('mag.render.begin', [name]);

    this.templates = this.templates || {};
    this.templates[name] = this.templates[name] || docFragRoot ? docFragRoot : 0;
    this.template = this.templates[name];
    docFragRoot = this.template;

    if (!docFragRoot || this.template === '') return false;

    var parent = docFragRoot.parentNode;
    docFragRoot.parentNode.removeChild(docFragRoot);

    this.node = docFragRoot;
    this.parent = parent;

    return {
      node: docFragRoot,
      parent: parent
    };
  };

  mag.render.parse = function (that, name, $scope) {

    this.captureCalls = function (name) {
      this.calls = this.calls || {};
      this.calls[name] = this.calls[name] || {};
      this.calls[name].times = this.calls[name].times + 1 || 1;
      return this.calls[name].times;
    };
    if (!this.node) return;
    // capture amount of times render is called per name
    log('info', name + '-render called: ' + this.captureCalls(name));

    var docFragRoot = this.node;
    var parent = this.parent;

    var ignoreMap = mag.reserved;
    this.applyVar = function (frag, key, vars) {
      if (!frag || !frag.nodeType) return;

      // TODO: enable staples [[parm]] by calling setVar for each
      for (var k in vars) {
        if (key === k && typeof vars[k] === 'object') {
          frag = frag.getElementsByClassName(key);
          return this.applyVars(frag[0], vars[k]);
        }
      }

      var items = frag.getElementsByClassName(key);
      var i = items.length;
      if (i < 1) {
        this.setVar(frag, key, vars);
      }
      while (i--) {
        this.setVar(frag, key, vars, items, i);
      }
    };
    this.setVar = function (frag, key, vars, items, i) {
      //don't call function unless match found
      //function context?
      function getVal(vars, key, context) {
        var val = (typeof vars[key] == 'function') ? vars[key].call(context || this) : vars[key];
        return val;
      }

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
          attr.nodeValue = attr.nodeValue.replace(pattern, function (out, inn, pos) {
            if (key == inn && ignoreMap.indexOf(key) === -1) {
              return getVal(vars, key);
            } else {
              return out;
            }
          });
        }
      }

      function replaceValue(pattern, ele, key) {
        ele.firstChild.nodeValue = ele.firstChild.nodeValue.replace(pattern, function (out, inn, pos) {
          if (key == inn && ignoreMap.indexOf(key) === -1) {
            return getVal(vars, key);
          } else {
            return out;
          }
        });
      }

      if (items && ignoreMap.indexOf(key) === -1 && ["INPUT", "TEXTAREA", 'SELECT'].indexOf(items[i].tagName) !== -1) {
        var val = getVal(vars, key, this);
        items[i].value = val;
      } else //USE CASE?
      // check for class match to key to replace all content, includes html??
      if (items && ignoreMap.indexOf(key) === -1) {
        //items[i].innerText = getVal(vars, key, this);
        setTextContent(items[i], getVal(vars, key, this));
      }
    };
    this.applyVars = function (frag, vars) {
      for (var key in vars) {
        this.applyVar(frag, key, vars);
      }
    };
    this.parser = function (docFragRoot, vars) {
      for (var key in vars) {

        if (_toString.call(vars[key]) === '[object Array]') {
          var sdocFragRoot = docFragRoot.getElementsByClassName(key);
          if (!sdocFragRoot[0]) return;
          var newelement = sdocFragRoot[0].cloneNode(true);
          var n = vars[key];
          for (var i = 0; i < n.length; i++) {

            var newest = newelement.cloneNode(true);
            var nvars = n[i];

            this.applyVars(newest, n[i]);
            sdocFragRoot[0].parentNode.appendChild(newest);
          }
          sdocFragRoot[0].parentNode.removeChild(sdocFragRoot[0]);
        } else {
          this.applyVar(docFragRoot, key, vars);
        }
      }
    };
    this.parser(docFragRoot, $scope);
    that.fire('mag.render.end', [name]);

    parent.appendChild(docFragRoot);
  };
  mag.aspect.add('around', 'control', mag.render.serve);

})(window.mag = window.mag || {}, mag.render = {});
