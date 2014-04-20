/**
 * @name mag-ui-event.js event attachment for mag.js
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

    for (var key in scope) {

      var val = scope[key];
      if (typeof val == 'function') {
        var elements = ele.findElementsByKey(key);
        // loop through elements
        if (elements[0] && !elements[0]._hasevent) {

          var eventType = elements[0].getAttribute('mg-event');
          if (eventType) {
            // don't add exact one twice

            var call = function(e) {
              if (typeof val == 'function') {

                // what if theres a delayed response - async??
                var promise = val.bind(scope).call(this, e);
                // if async this will fire prematurely
                // allow for a promise return 
                // promise.resolve(function(){});
                (that.controls[name]);
              }
            }.bind(this);

            if (!elements[0].parentNode._hasevent) {
              elements[0].parentNode.addEventListener(eventType, call, false);
              elements[0].parentNode._hasevent = true;
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
