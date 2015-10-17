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

mag.request = function(options) {
  var deferred = mag.deferred();
  var client = new XMLHttpRequest();
  var method = (options.method || 'GET').toUpperCase();


  var data = method === "GET" || !options.data ? "" : options.data

  
  client.onload = function(e) {
    var ct = client.getResponseHeader("content-type") || "";
    var data = e.target.responseText;
    if (ct.indexOf('json') > -1) {
      data = JSON.parse(data)
    }
    deferred.resolve(data)
  }
  
  client.onerror = function(e) {
    deferred.reject(e)
  };
  
    client.open(method, options.url);
  client.send(data);
  
  return deferred.promise
}
