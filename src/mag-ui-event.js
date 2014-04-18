/**
 * @name mag-ui-event.js two way ui binding for mag.js
 * @link https://github.com/magnumjs/mag.js
 * @license MIT
 * @owner copyright (c) 2013, 2014 Michael Glazer
 */
'use strict';
(function(mag, uiEvent, undefined) {

  uiEvent.server = function(scope) {

    // check for data events to add via scope keys
    var ele = mag.domElement(mag.render.template);
    ele.getSelectorDataKey('event');

    for (var key in scope) {

      var val = scope[key];
      if (typeof val == 'function') {

        var elements = ele.findElementsByKey(key);
        // loop through elements
        if (elements[0]) {
          var eventType = elements[0].getAttribute('mag-event');
          if (eventType) {
            // don't add exact one twice
            if (elements[0]['on' + eventType] != val) {
              elements[0].addEventListener(eventType, val.bind(scope), false);
            }
          }
        }
      }
    }
  };

  uiEvent.serve = function(name) {
    var rootScope = this;
    var scope = this.getScope(name);
    this.on('mag.render.end', function() {
      mag.uiEvent.server(scope);
    });
  };

  mag.aspect.add('before', 'control', uiEvent.serve);

})(window.mag = window.mag || {}, mag.uiEvent = {});
