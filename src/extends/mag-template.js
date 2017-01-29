/*
@name mag-templater
@author Michael Glazer (c)
@License MIT
@date January 29th, 2017
@description allows for existing functionality in Mag.JS to include template Urls
@example mag|mag.module|mag.create('templateFile.html', Module)
@example mag|mag.module|mag.create({templateUrl: 'template.html', view: function(state){}} )
@requires - Mag.JS - addons and core latest
@link http://github.com/magnumjs/mag.js
*/


mag = (function(_super) {

  var findIdTemplate = function(idOrNode, mod, props, fun) {
    //CASE: if idOrNode is an object not HTMLElement
    //load templateUrl from object if it has one 
    if (mag.utils.isObject(idOrNode) && idOrNode.templateUrl) {
      return getTemplate(idOrNode.templateUrl, idOrNode, mod, fun)
    } else if (typeof idOrNode == 'string' && ~idOrNode.indexOf(".html")) {
      return getTemplate(idOrNode, mod, props, fun)
    } else {
      return fun(idOrNode, mod, props);
    }
  }

  var getTemplate = function(url, mod, props, orig) {
    return mag.request(url)
      .then(function(data) {

        var template = document.createElement('template');
        template.innerHTML = data;

        return orig(mag.getNode(mag._isNode(template.content.children[0])), mod, props || {});
      })
  };

  // return our new `mag()` function
  var extended = function(idOrNode, mod, props) {
    //original constructor
    var fun = _super;
    return findIdTemplate(idOrNode, mod, props, fun)
  };

  extended.module = function(idOrNode, mod, props) {
    var fun = _super.module;
    return findIdTemplate(idOrNode, mod, props, fun)
  }

  Object.assign(extended, _super)

  return extended

})(mag);
