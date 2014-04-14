;
'use strict';
(function(magnum, undefined) {
  var _toString = Object.prototype.toString;

  mag.template.serve = function(f) {
    mag.aspect.next(f);
    var name = f.arguments[0];
    var scope = this.getScope(name);
    var that = this;
    this.on('propertyChanged', function() {
      mag.template.parse(that, name, scope);
    });
    mag.template.parse(that, name, scope);
  };

  mag.template.parse = function(that, name, $scope) {
    log('info', 'template parse start' + name);

    var docFragRoot = document.getElementById(name);
    that.fire('mag.template.begin', [name]);

    this.templates = this.templates || {};
    this.templates[name] = this.templates[name] || docFragRoot ? docFragRoot : 0;
    this.template = this.templates[name];
    var docFragRoot = this.template;

    if (!docFragRoot || this.template == '') return;

    var parent = docFragRoot.parentNode;
    docFragRoot.parentNode.removeChild(docFragRoot);
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
      var val = (typeof vars[key] == 'function') ? vars[key].call(this) : vars[key];
      this.pattern = this.pattern || new RegExp('\\[\\[(.*?)\\]\\]', 'g');
      frag.innerHTML = frag.innerHTML.replace(this.pattern, function(out, inn, pos) {
        if (val && key == inn && ignoreMap.indexOf(key) === -1) {
          return val;
        } else {
          return out;
        }
      });
      //USE CASE?
      if (val && items && ignoreMap.indexOf(key) === -1 && items[i].innerText == '') {
        items[i].innerText = val;
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
    that.fire('mag.template.end', [name]);
    parent.appendChild(docFragRoot);
  };
  mag.aspect.add('around', 'control', mag.template.serve);
})(window.mag = window.mag || {}, mag.template = {});
