//////////////////////////////////
//MagJS
//////////////////////////////////

/*!
 * MagnumJS - Core Control Factory v0.11.1
 * https://github.com/magnumjs
 *
 * Includes Staples.js & Glue.JS
 * https://github.com/magnumjs/mag.js
 *
 * Copyright 2013 Michael GLazer 
 * Released under the MIT license
 * https://github.com/magnumjs/mag.js/blob/master/LICENSE
 *
 * Date: 2013-08-10T13:48Z
 */
 'use strict';;
(function ($, namespace, undefined) {
    // public method
    namespace.getName = function (obj) {
        for (key in this) {
            if (obj === this[key]) return key;
        }
    }
    namespace.getScope = function (name) {
        return this.controls[name] || {};
    }
})(jQuery, window.mag = window.mag || {});

mag.options = function (options) {
    var a = [],
        modelsArray = [];
    for (var k in options) {
        if (typeof options[k] == 'function') {
            a[0] = options[k];
        } else {
            modelsArray.push(options[k]);
        }
    }
    a[1] = modelsArray;
    return a;
}

mag.observe = function () {

    this.observers = this.observers || {};
    this.on = function (eventName, listener) {
        if (!this.observers[eventName]) this.observers[eventName] = [];
        this.observers[eventName].push(listener);
    };
    this.fire = function (eventName) {
        if (this.observers[eventName]) {
            for (var i = 0; i < this.observers[eventName].length; i++) {
                this.observers[eventName][i](this);
            }
        }
    };
    this.make = function (ObjectName) {
        ObjectName.prototype.fire = this.fire;
        ObjectName.prototype.fire = this.on;
        ObjectName.prototype.fire = this.observers = {};
    };
    return this;
};

mag.instance = function (name) {

    this.controls = this.controls || {};
    this.controls[name] = this.controls[name] || {};

}
mag.tape = function (name, options) {
    var a = mag.options(options);
    mag.instance(name);
    var $scope = mag.getScope(name);
    var args = a[1] || [];
    args.splice(0, 0, $scope);

    $(document).trigger('mag-preload', [name]);
    a[0].apply(this, args);
    $(document).trigger('mag-postload', [name]);
    return name;
};
