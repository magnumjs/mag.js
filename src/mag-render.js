/**
 * @name mag-render.js two way ui binding for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */
'use strict';
(function(magnum, undefined) {
  var _toString = Object.prototype.toString;

  mag.render.serve = function(f) {
    // pre parse it
    // get Controller's scopeContextContainer 'name'
    // get it's element, nested controller? parent context?
    var name = f.arguments[0];

    var found = mag.render.preParser(this, name);

    // don't go to next 'controller' if the container doesn't exist
    // put back into loop for rechecking ?
    if (!found) return;

    mag.aspect.next(f);
    var scope = this.getScope(name);
    var that = this;

    this.on('propertyChanged',
      mag.watch.throttle(
        function() {
          this.count = this.count + 1 || 0;
          //   console.log('parser'+this.count);
          mag.render.parse(that, name, scope);
          // mag.watch.throttle( mag.render.parse(that, name, scope));
        }
      )
    );

    this.on('propertyAccessed',
      mag.watch.throttle(
        function() {
          this.count = this.count + 1 || 0;
          //console.log('rendere'+this.count);
          mag.render.parse(that, name, scope);
          //mag.watch.throttle( mag.render.parse(that, name, scope));
        }
      )
    );

    mag.render.parse(that, name, scope);
  };

  mag.render.preParser = function(that, name) {
    log('info', 'template parse start' + name);

    var docFragRoot = document.getElementById(name);
    that.fire('mag.render.begin', [name]);

    this.templates = this.templates || {};
    this.templates[name] = this.templates[name] || docFragRoot ? docFragRoot : 0;
    this.template = this.templates[name];
    var docFragRoot = this.template;

    if (!docFragRoot || this.template == '') return false;

    var parent = docFragRoot.parentNode;
    docFragRoot.parentNode.removeChild(docFragRoot);

    this.node = docFragRoot;
    this.parent = parent;

    return {
      node: docFragRoot,
      parent: parent
    };
  };

  mag.render.parse = function(that, name, $scope) {
    if (!this.node) return;

    var docFragRoot = this.node;
    var parent = this.parent;

    var ignoreMap = mag.reserved;
    this.applyVar = function(frag, key, vars) {
      if (!frag.nodeType) return;
      var items = frag.getElementsByClassName(key);
      var i = items.length;
      if (i < 1) {
        this.setVar(frag, key, vars);
      }
      while (i--) {
        this.setVar(frag, key, vars, items, i);
      }
    };
    this.setVar = function(frag, key, vars, items, i) {
      //don't call function unless match found
      //function context?
      function getVal(vars, key, context) {
        var val = (typeof vars[key] == 'function') ? vars[key].call(context || this) : vars[key];
        return val;
      }
      this.pattern = this.pattern || new RegExp('\\[\\[(.*?)\\]\\]', 'g');
      frag.innerHTML = frag.innerHTML.replace(this.pattern, function(out, inn, pos) {
        if (key == inn && ignoreMap.indexOf(key) === -1) {
          return getVal(vars, key);
        } else {
          return out;
        }
      });
      //USE CASE?
      if (items && ignoreMap.indexOf(key) === -1 && items[i].innerText == '') {
        items[i].innerText = getVal(vars, key, this);
      }
    };
    this.applyVars = function(frag, vars) {
      for (var key in vars) {
        this.applyVar(frag, key, vars);
      }
    };
    this.parser = function(docFragRoot, vars) {
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
