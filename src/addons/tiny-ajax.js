/*
Author: Michael Glazer
Homepage: https://github.com/magnumjs/mag.js
License MIT
(c) 2015
*/


//Example:

/*
  mag.request({
    url: 'https://api.github.com/users/defunkt'
  }).then(function(data) {
    console.log(data)
  })
*/

  /*
  var d = mag.deferred()

  d.promise.then(function() {
    console.log('success', arguments)
  }, function() {
    console.log('failure', arguments)
  })
  d.reject({
    things: false
  })
  d.resolve({
    things: []
  })
  */

  mag.deferred = function() {
    var Deferred = {}
    Deferred.promise = new Promise(function(resolve, reject) {
      Deferred.resolve = resolve
      Deferred.reject = reject
    })
    return Deferred
  }

  mag.when = function(arrayOfPromises, callback) {
    Promise.all(arrayOfPromises).then(callback)
  }

  /*
  mag.request({
     url: 'https://api.github.com/users/defunkt'
   })
  */
  
  //TODO: add jsonp support

mag.request = function(options) {
  var deferred = mag.deferred();
  var key = JSON.stringify(options)
  if (options.cache) {
    var cache = mag.cache(key)
    if (cache) {
      deferred.resolve(cache)
      return deferred.promise
    }
  }
  var client = new XMLHttpRequest();
  var method = (options.method || 'GET').toUpperCase();
  var data = method === "GET" || !options.data ? "" : options.data

  client.onload = function(e) {
    var ct = client.getResponseHeader("content-type") || "";
    var data = e.target.responseText;
    if (ct.indexOf('json') > -1) {
      data = JSON.parse(data)
    }
    if (options.cache) {
      mag.cache(key, data, options.cacheTime)
    }
    deferred.resolve(data)
  }

  client.onerror = function(e) {
    deferred.reject(e)
  };

  client.open(method, options.url);
  client.send(data);
  
  if (options.initialValue) {
    deferred.promise.initialValue = options.initialValue
  }

  return deferred.promise
}

mag.cache = function(key, data, cacheTime) {

  if (arguments.length == 1) {
    if (mag.cache.data[key]) return mag.cache.data[key].data;
    else return 0
  }

  if (mag.cache.data[key] && mag.cache.data[key].id) clearTimeout(mag.cache.data[key].id)

  var intervalID = setTimeout(function(key) {
    delete mag.cache.data[key]
  }.bind({}, key), cacheTime || 1000 * 60 * 10); //10 minutes

  mag.cache.data[key] = {
    id: intervalID,
    data: data
  }
}

mag.cache.data={}
