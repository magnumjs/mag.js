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
        //TODO: loop through elements

        if (!elements[0]) continue;
        elements[0]._events = elements[0]._events || [];
        if (elements[0] && elements[0]._events.indexOf(key) === -1) {

          var eventType = elements[0].getAttribute('mg-event');
          if (eventType) {
            // don't add exact one twice

            var call = function(e) {
              if (typeof val == 'function') {

                if (e.stopPropagation) e.stopPropagation();
                // support IE necessary?
                if (e.cancelBubble != null) e.cancelBubble = true;

                var promise = (function(val, context, scope, that, e) {
                  // what if theres a delayed response - async??
                  var promise = val.bind(scope).call(context, e);
                  // if async this will fire prematurely
                  // allow for a promise return 
                  // promise.resolve(function(){});
                  (that.controls[name]);
                  return promise;
                })(val, this, scope, that, e);
              }
            }.bind(this);

            if (elements[0]._events.indexOf(key + eventType) === -1) {
              elements[0].addEventListener(eventType, call, false);
              elements[0]._events.push(key + eventType);
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
