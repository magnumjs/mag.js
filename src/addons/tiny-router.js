/*
Tiny Router: v0.1
Adapted to MagJS
Author: Michael Glazer
Link: https://github.com/magnumjs/mag.js
Originally from: https://github.com/ccoenraets/react-employee-directory
*/

/** EXAMPLE **/

/*
mag.route.addRoute('', function() {
    this.page = 'home'
}.bind(this));
mag.route.addRoute('employees/:id', function(id) {
    this.page = ''
    this.selectedEmployeeId = id;
}.bind(this));

mag.route.start();
*/



var mag = mag || {}

mag.route = (function (window) {

    'use strict';

    var routes = [];

    function addRoute(route, handler) {

        routes.push({parts: route.split('/'), handler: handler});
    }

    function load(route) {
        window.location.hash = route;
    }

    function start() {

        var path = window.location.hash.substr(1),
            parts = path.split('/'),
            partsLength = parts.length;

        for (var i = 0; i < routes.length; i++) {
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
                    route.handler.apply(undefined, params);
                    return;
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
