/*
Name: Mag-importer v0.1.4
Description: similar to html-imports implementation
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js & mag addons
(c) 2016
*/

;
(function(mag, document) {

  'use strict';

  mag.importer = function(url, eleSelector) {

    function checkIfIncluded(file, node) {
      var links = node.getElementsByTagName("link");
      for (var i = 0; i < links.length; i++) {
        if (links[i].href.substr(-file.length) == file) {
          return true;
        }
      }

      var scripts = node.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src.substr(-file.length) == file) {
          return true;
        }
      }

      return false;
    }

    function getId(id) {
      if (typeof mag.importer.ids[id] !=='undefined') {
        return id + (++mag.importer.ids[id]);
      } else {
        return id + (mag.importer.ids[id] = 0);
      }
    }

    function loadInternalScripts(node, type) {
      var scripts = node.getElementsByTagName(type);
      // multiple promises
      var promises = [];
      var names = {}
      for (var i = 0; i < scripts.length; i++) {
        // and doesn't already exist
        var url = type == 'script' ? scripts[i].attributes.src.value : scripts[i].attributes.href.value;
        if (url != "") {

          if (checkIfIncluded(url, node)) {
            promises.push(mag.importer.namedPromises[url].promise);
            continue;
          }

          var deferred = mag.deferred();
          if (!names[url]) {
            mag.importer.namedPromises[url] = names[url] = deferred;
          } else continue;

          var tag = document.createElement(type);
          tag[(type == 'script' ? 'src' : 'href')] = url;
          if (type == 'link') tag.rel = 'stylesheet';

          tag.onload = function() {
            deferred.resolve(1);
          }

          document.getElementsByTagName("head")[0].appendChild(tag);
          promises.push(deferred.promise);
        }
      }
      return promises;
    }

    return mag.request({
        url: url,
        cache: true
      })
      .then(function(data) {
        //save data
        //get html as node
        var template = document.createElement('template');
        template.innerHTML = data;
        var newNode = template.content.firstChild;

        var promises1 = loadInternalScripts(newNode, 'link');
        var promises2 = loadInternalScripts(newNode, 'script');
        var promises = mag.merge(promises1, promises2);
        var deferred = mag.deferred();

        return mag.when(promises, function() {
          // multiple invocations
          if (eleSelector) {
            var node = document.querySelector(eleSelector);
            newNode.children[0].id = eleSelector
            node.appendChild(newNode.children[0]);
            deferred.resolve(eleSelector);
          } else {
            // track incoming ids and increment
            newNode.children[0].id = getId(newNode.children[0].id)
            deferred.resolve({
              _html: newNode.children[0].outerHTML,
              id: newNode.children[0].id
            });
          }
          return deferred.promise;
        });
      });
  };
  mag.importer.ids = {};
  mag.importer.namedPromises = {};

})(mag, document);
