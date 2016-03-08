mag.importer = function(url, eleSelector) {

  function checkIfIncluded(file) {
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.substr(-file.length) == file) {
        return true;
      }
    }

    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.substr(-file.length) == file) {
        return true;
      }
    }

    return false;
  }

  function loadInternalScripts(node) {
    var scripts = node.getElementsByTagName("script");
    var links = node.getElementsByTagName("link");

    // multiple promises
    var promises = [];
    var names = {}
    for (var i = 0; i < scripts.length; i++) {
      // and doesn't already exist
      var url = scripts[i].attributes.src.value;
      if (url != "") {

        if (checkIfIncluded(url)) {
          promises.push(mag.importer.namedPromises[url].promise);
          continue;
        }

        var deferred = mag.deferred();
        if (!names[url]) {
          mag.importer.namedPromises[url] = names[url] = deferred;
        } else continue;

        var tag = document.createElement("script");
        tag.src = url;
        tag.onload = function() {
          deferred.resolve(1);
        }
        document.getElementsByTagName("head")[0].appendChild(tag);
        promises.push(deferred.promise);

      }
    }
    return promises;
  }

  var deferred = mag.deferred();

  mag.request({
      url: url,
      cache: true
    })
    .then(function(data) {
      //save data
      //get html as node
      var template = document.createElement('template');
      template.innerHTML = data;
      var newNode = template.content.firstChild;

      var node = document.querySelector(eleSelector);

      var promises = loadInternalScripts(newNode);

      mag.when(promises, function() {
        // multiple invocations
        newNode.children[0].id = eleSelector
        node.appendChild(newNode.children[0]);
        deferred.resolve(1);
      })

    });
  return deferred.promise;
};

mag.importer.namedPromises = {};
