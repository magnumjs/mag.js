/**
* @name watch.js two way ui binding for mag.js
* @owner copyright (c) 2013 Michael Glazer
*/

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

;
'use strict';
(function ($, namespace, undefined) {

    mag.broadcast = {};

})(jQuery, window.mag = window.mag || {});

mag.broadcast.serve = function (name) {

    this.on('tmpl-begin', function (name) {});
    this.on('tmpl-end', function (name) {

        var $scope = this.getScope(name);

        this.controls[name] = new mag.broadcast.watch(this);


        for (k in $scope) {

            this.controls[name][k] = $scope[k];
            this.controls[name]._bind($('#' + k), k);
            this.controls[name]._watch($('.' + k), k);

        }

    });

};

mag.broadcast.watch = function (rootScope) {
    //The property is changed whenever the dom element changes value
    //TODO add a callback ?
    this._bind = function (DOMelement, propertyName) {
        //The next line is commented because priority is given to the model
        //this[propertyName] = $(DOMelement).val();
        var _ctrl = this;
        $(DOMelement).on("change input click propertyChange", function (e) {
            _ctrl[propertyName] = DOMelement.val();
            return true;
        });

    }

    //The dom element changes values when the propertyName is setted
    this._watch = function (DOMelement, propertyName) {
        //__watch triggers when the property changes
        this.__watch(propertyName, function (property, value) {
            rootScope.fire('propertyChanged', [property, value]);
            $(DOMelement).text(value);
        });
    };
};

mag.aspect.add('after', 'control', mag.broadcast.serve);
