'use strict';

//////////////////////////////////
//MagJS
//////////////////////////////////

/**
 * @ngdoc function
 * @name mag.glue
 * @function
 *
 * @description
 * Maintains scope values within a name callback feature with pushed array arguments
 *
 */
 
;(function( $, namespace, undefined ){
    // public method
    namespace.getName = function(obj){
      for(key in this){
      if(obj === this[key]) return key; 
      }
    }
    namespace.getScope = function(name){
      return this.controls[name]||{};
    }
})( jQuery, window.mag = window.mag || {});

mag.options=function(options){
  var a=[],modelsArray=[];
  for(k in options){
    if(typeof options[k] == 'function'){
      a[0]=options[k];
    }else{
      modelsArray.push(options[k]);
    }
  }
  a[1]=modelsArray;
  return a;
}
mag.instance=function(name){
 
  this.controls = this.controls || {};
  this.controls[name] = this.controls[name] || {};

}
mag.tape=function(name,options){
  a=mag.options(options);
  mag.instance(name);
  var $scope = mag.getScope(name);
  args = a[1] || [];
  args.splice(0, 0, $scope);
 
  $(document).trigger('mag-preload',[name]);
  a[0].apply(this,args);
  $(document).trigger('mag-postload',[name]);
  return name;
};
