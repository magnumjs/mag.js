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

//controller options ['','' .. function]
// make into new array and move the function to the first index
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
// event listeners and firing
mag.observe = function () {

    this.observers = this.observers || {};
    this.on = function (eventName, listener) {
        if (!this.observers[eventName]) this.observers[eventName] = [];
        this.observers[eventName].push(listener);
    };
    this.fire = function (eventName, args) {
        if (this.observers[eventName]) {
            for (var i = 0; i < this.observers[eventName].length; i++) {
                this.observers[eventName][i].apply(this, args);
            }
        }
    };
    this.make = function (ObjectName) {
        ObjectName.prototype.fire = this.fire;
        ObjectName.prototype.on = this.on;
        ObjectName.prototype.observers = {};
    };
    return {
        on: this.on,
        fire: this.fire,
        make: this.make,
        observers: this.observers
    };
};
// factory cache of named instances
mag.instance = function (name) {

    this.controls = this.controls || {};
    this.controls[name] = this.controls[name] || {};

}
mag.services = function (names) {
    this.services = this.services || {};
    var servicesArray = [];
    for (var i = 0; i < names.length; i++) {
        this.services[names[i]] = this.services[name[i]] || {};
        servicesArray.push(this.services[names[i]]);
    }
    return servicesArray;
}
// tape together controller of arguments, scope and instances
mag.tape = function (name, options) {
    // insert options, besides callback function into it
    var a = mag.options(options);
    var fun = a[0];
    a.splice(0, 1);
    mag.instance(name);
    var $scope = mag.getScope(name);
    var args = a[0] || [];

    // check if any are services existing
    var sargs = mag.services(args);
    sargs.splice(0, 0, $scope);

    this.fire('mag-preload', [name]);
    fun.apply(this, sargs);
    this.fire('mag-postload', [name]);
    return name;
};


//Got this great piece of code from https://gist.github.com/384583
Object.defineProperty(Object.prototype, "__watch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop, handler) {
        var val = this[prop],
            getter = function () {
                return val;
            },
            setter = function (newval) {
                val = newval;
                handler.call(this, prop, newval);
                return newval;
            };

        if (delete this[prop]) { // can't watch constants
            Object.defineProperty(this, prop, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    }
});

mag.watch = function () {
    //The property is changed whenever the dom element changes value
    //TODO add a callback ?
    this._bind = function (DOMelement, propertyName) {
        //The next line is commented because priority is given to the model
        //this[propertyName] = $(DOMelement).val();
        var _ctrl = this;
        $(DOMelement).on("change input click propertyChange", function (e) {
            // e.preventDefault();
            _ctrl[propertyName] = DOMelement.val();
            return true;
        });

    }

    //The dom element changes values when the propertyName is setted
    this._watch = function (DOMelement, propertyName) {
        //__watch triggers when the property changes
        this.__watch(propertyName, function (property, value) {
            mag.observe().fire('propertyChanged', [property, value]);
            $(DOMelement).text(value);
        });
    };
};
