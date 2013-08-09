var mag = {};
mag.funName=function(fun){
var ret = fun.toString();
  ret= ret.substr('function '.length)
  ret =ret.substr(0, ret.indexOf('('));
  return ret;
};
mag.instance=function(fun){
  name=mag.funName(fun);
  this.controls = this.controls || {};
    this.controls[name] = this.controls[name] || {};
  return name;
}
mag.tape=function(modelsArray,fun){

 name=mag.instance(fun);
   var $scope = this.controls[name];
   args = modelsArray || [];
    args.splice(0, 0, $scope);
  
  //$(document).trigger('preLoad-');
  fun.apply(this,args);
console.log($scope);
};

var t=function TodosWidget($scope){

  $scope.test=1;
 
};

mag.tape(['item','anothjer'],t);
