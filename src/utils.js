 /*
MagJS v0.17
http://github.com/magnumjs/mag.js
(c) Michael Glazer
License: MIT
*/
 (function(mag) {

   'use strict';

   var utils = {},
     forcing = false,
     lastRedrawId = null,
     lastRedrawCallTime = 0,
     FRAME_BUDGET = 16,
     $cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout,
     $requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;



   utils.callHook = function(hookins, key, name, i, data, before) {
     data.change = false
     if (hookins[name][i].key == key) {
       before = JSON.stringify({
         v: data.value,
         k: data.key
       })
       hookins[name][i].handler.call(hookins[name][i].context, data)
         //if any change
       if (before !== JSON.stringify({
           v: data.value,
           k: data.key
         })) {
         data.change = true
       }
     }
   }


   utils.throttle = function(redraw, force) {
     if (utils.throttle.redrawing) return;
     utils.throttle.redrawing = true;
     if (force) forcing = true;
     try {
       //lastRedrawId is a positive number if a second redraw is requested before the next animation frame
       //lastRedrawID is null if it's the first redraw and not an event handler
       if (lastRedrawId && !force) {
         //when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
         //when rAF: always reschedule redraw
         if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
           if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
           lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
         }
       } else {
         redraw();
         lastRedrawId = $requestAnimationFrame(function() {
           lastRedrawId = null;
         }, FRAME_BUDGET);
       }
     } finally {
       utils.throttle.redrawing = forcing = false;
     }
   };
   utils.throttle.redrawing = false;

   utils.unloaders = []
   utils.callLCEvent = function(eventName, controller, node, index, once) {
     var isPrevented = false,
       event = {
         preventDefault: function() {
           isPrevented = true
         }
       }
     if (controller && controller[eventName]) {
       controller[eventName].call({}, event, node)
       if (once) controller[eventName] = 0
     }

     if (isPrevented) {
       // unloading

       for (var i = 0, unloader; unloader = utils.unloaders[index][i]; i++) {

         if (unloader.controller.onunload) {
           unloader.handler.call(unloader.controller, node)
           unloader.controller.onunload = 0
         }
       }
     }

     return isPrevented
   }

   //UTILITY
   utils.copy = function(o) {
     var out, v, key;
     out = Array.isArray(o) ? [] : {};
     for (key in o) {
       v = o[key];
       out[key] = (typeof v === "object") ? utils.copy(v) : typeof v == 'function' ? v() : v;
     }
     return out;
   }

   utils.merge = function(source, destination) {
     for (var k in source) destination[k] = source[k]
     return destination;
   }

   var a = {
     i: [],
     isItem: function(id) {
       return a.i.indexOf(id) > -1
     },
     setItem: function(id) {
       a.i[a.i.length] = id
     },
     getItem: function(id) {
       return a.i.indexOf(id)
     },
     removeItem: function(id) {
       a.i.splice(a.i.indexOf(id), 1)
     }
   }

  utils.items = a

   utils.getItemInstanceIdAll = function() {
     return a.i
   }

   utils.getItemInstanceId = function(id) {
     if (a.isItem(id)) {
       return a.getItem(id)
     } else {
       a.setItem(id)
       return a.getItem(id)
     }
   }


   mag.utils = utils

 }(window.mag || {}));
