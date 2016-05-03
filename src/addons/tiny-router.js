/*
Tiny Router: v0.2
Adapted to MagJS
Author: Michael Glazer
Link: https://github.com/magnumjs/mag.js
Originally from: https://github.com/ccoenraets/react-employee-directory
*/

/** EXAMPLE **/

/*
mag.route.addRoute('', function() {
    this.page = 'home'
    //onexit handler
    return function(nextUrl){
        //return true to prevent transition to next url when url is loaded via mag.route.load('')
    }
}.bind(this));
mag.route.addRoute('employees/:id', function(id) {
    this.page = ''
    this.selectedEmployeeId = id;
}.bind(this));

mag.route.start();
// call urls with mag.route.load('employees/1234')
*/



mag.route = (function(window) {

  'use strict';

  var routes = [],
    lastUrl = '';

  function addRoute(route, handler) {
    routes.push({
      parts: route.split('/'),
      handler: handler
    });
  }

  function load(route) {
    var exiting = route !== lastUrl;
    if (exiting) {
      // get onexit handler of last route
      var paths = parseUrl('#' + lastUrl);
      var found = getHandler(routes, paths.parts);
      if (found && found.route.onexit) {
        if(found.route.onexit.apply({}, [route])) return;
      }
    }
    window.location.hash = route;
  }


  function parseUrl(url) {
    var path = url.substr(1),
      parts = path.split('/');
    return {
      path: path || '',
      parts: parts
    }
  }

  function start(e) {
    //Get URL event information
    var newURL = parseUrl('#' + (window.location.hash.split('#') || '')).path;
    if (e) {
      newURL = parseUrl('#' + (e.newURL.split('#')[1] || '')).path;
    }
    //Add to history:
    lastUrl = newURL;

    //Parse url
    var paths = parseUrl(window.location.hash);
    //Get route handler
    var found = getHandler(routes, paths.parts);
    if (found) {
      //Run route
      var onexit = found.route.handler.apply({}, found.params);
      //Check for onexit callback
      if (onexit) routes[found.index].onexit = onexit;
    }
  }

  function getHandler(routes, parts) {
    var partsLength = parts.length;
    for (var i = 0, size = routes.length; i < size; i++) {
      var route = routes[i];
      if (route.parts.length === partsLength) {
        var params = [];
        for (var j = 0; j < partsLength; j++) {
          if (route.parts[j].substr(0, 1) === ':') {
            params.push(parts[j]);
          } else if (route.parts[j] !== parts[j]) {
            break;
          }
        }
        if (j === partsLength) {
          return {
            index: i,
            route: route,
            params: params
          };
        }
      }
    }
  }


  window.onhashchange = start;

  return {
    addRoute: addRoute,
    load: load,
    start: start
  };

}(window));
