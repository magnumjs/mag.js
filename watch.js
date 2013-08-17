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
          mag.observe().fire('propertyChanged',[property,value]);
            $(DOMelement).text(value);
        });
    };
};


mag.broadcast=function(){
 
  mag.observe().on('tmpl-begin',function(name){
  });
  mag.observe().on('tmpl-end',function(name){
    
    var $scope = mag.getScope(name);
 
    var ctrl = new mag.watch();
    for(k in $scope){

      ctrl[k] = $scope[k];
      ctrl._bind($('#'+k), k);
      ctrl._watch($('.'+k), k);
      
    }
    
  });

};
