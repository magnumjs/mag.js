/**
* @name magLite.js
* @description lite refactor of MagnumJS core code library
* @author Michael Glazer 
* @link https://github.com/magnumjs - http://jsbin.com/EsuYEYe/10/edit
*/

mag={};
mag.module=function(name){
 var Injector = {
    
    dependencies: {},
    
    process: function(target) {
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var text = target.toString();
        var args = text.match(FN_ARGS)[1].split(',');
        
        target.apply(target, this.getDependencies(args));
    },
    
    getDependencies: function(arr) {
        var self = this;
        return arr.map(function(value) {
            
            return self.dependencies[value];
        });            
    },
    
    register: function(name, dependency) {
        this.dependencies[name] = dependency;
    }

};
  return new function(){
  this.name=name;
  this.service=function(name,fun){
    this.services=this.services||{};
    this.services[name]=new fun();
     Injector.register(name,this.services[name]);
  }
  this.control=function(name,fun){
    this.controls=this.controls||{};
    Injector.register('Scope',this.getScope());
    this.fire('mag-preload', [name]);
    Injector.process(fun);
    this.fire('mag-postload', [name]);
  }
  this.getScope=function(name){
    return    this.controls[name] = this.controls[name] || {};
  }
  this.observers={};
  this.on = function (eventName, listener) {
    if (!this.observers[eventName]) this.observers[eventName] = [];
    this.observers[eventName].push(listener);
  }
  this.fire = function (eventName, args) {
     if (this.observers[eventName]) {
            for (var i = 0; i < this.observers[eventName].length; i++) {
                this.observers[eventName][i].apply(this, args);
            }
        }
    }
  }
}

/*
var app = mag.module('myApp');

console.log(app);

// singleton object instance "new"
app.service('Api',function(){
  this.getProjects = function(){  
    return new Object({first:'Mike',last:'Glazer'});
  }
});

app.control('myCtrl',function(Scope,Api){
       Scope.list=Api.getProjects();  
  console.log(Scope);
});
*/
