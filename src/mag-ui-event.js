/**
 * @name mag-ui-event.js two way ui binding for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */
'use strict';
(function(mag, uiEvent, undefined) {

  uiEvent.server = function(scope, name) {

    // check for data events to add via scope keys
    var ele = mag.domElement(mag.render.template);
    ele.getSelectorDataKey('event');

    var that = this;

    this.done = this.done || {};
    this.done[name] = this.done[name] || {};

    for (var key in scope) {

      if (this.done[name][key]) continue;
      this.done[name][key] = 1;
      var val = scope[key];
      if (typeof val == 'function') {

        var elements = ele.findElementsByKey(key);
        // loop through elements
        if (elements[0]) {

          var eventType = elements[0].getAttribute('mag-event');
          if (eventType) {
            // don't add exact one twice
            if (elements[0]['on' + eventType] != val) {
              var call = function() {
                if (typeof val == 'function') {

                  // what if theres a delayed response - async??
                  var promise = val.bind(scope).call(this);
                  // if async this will fire prematurely
                  // allow for a promise return 
                  // promise.resolve(function(){});
                  (that.controls[name]);
                }
              }.bind(this);

              elements[0].addEventListener(eventType,
                call, false);
            }
          }
        }
      }
    }
  };

  uiEvent.serve = function(name) {
    var rootScope = this;
    var scope = this.getScope(name);
    var that = this;
    this.on('mag.render.end', function() {
      mag.uiEvent.server.call(this, scope, name);
    });
  };

  mag.aspect.add('after', 'control', uiEvent.serve);

})(window.mag = window.mag || {}, mag.uiEvent = {});
