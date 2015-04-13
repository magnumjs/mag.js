MagJS
======

###Magnum JavaScript

###MAG = Modular Application Glue

The new (v2) stuff!
https://github.com/magnumjs/mag.js/tree/master/new

####Simple dependency injection - module, service, factory, control, config, directives - DOM modeling

[Jasmine Specs] (https://rawgit.com/magnumjs/mag.js/master/index.html)

Include the script into your page:
#### HTML Script TAG
```html
<script type="text/javascript" src="//rawgit.com/magnumjs/mag.js/master/dist/mag.full-0.2.min.js"></script>
```

# Examples

## Create Event Control

#### Define a Module
They are inheritable and reusable
```javascript
var app = mag.module('myApp');
```

#### Define a control
They can be injected with services or factories.
They relay data to the view via the 'Scope' first argument
```javascript
app.control('myCtrl', function(Scope, Api) {
  Scope.first = Api.getProjects().first;
  Scope.last = Api.getProjects().last;
});
```

#### Define a service
Use the [] style arguments when minifying.
```javascript
app.service('Api', function() {
  this.getProjects = function() {
    return new Object({
      first: 'Michael',
      last: 'Glazer'
    });
  };
});
```

#### Define a control
The order doesn't matter.
```javascript
app.control('myCtrl', function(Scope) {
  Scope.greet = 'Hello';
  
  Scope.add = function(Event) {
    this.clicks = this.clicks + 1 || 1;
    alert(Event.type + this.clicks  + this.greet);
  };
});
```

[Try it out] (http://jsbin.com/hopokibi/edit)


## Create a JSON Module:

Factory, Service, Control
#### Define a Module
```javascript
var githubUser = mag.module('githubUserApp');
```

#### Define a factory
They do maintain state, they are instantiated with a 'new'
```javascript
githubUser.factory('GithubUser', function() {
  var GithubUser = function(data) {
    $.extend(this, {
      id: null,
      collection: [],
      status: 'NEW',
      isNew: function() {
        return (this.status == 'NEW' || this.id == null);
      }
    });
    $.extend(this, data);
  };
  return GithubUser;
});
```

#### Define a service
They can be injected with factories.
```javascript
      githubUser.service('GithubUserService', function(GithubUser) {
        this.getById = function(userId) {
          return $.get('https://api.github.com/users/' + userId).then(
            function(response) {
              return new GithubUser(response);
            });
        };
      });
```

#### Define a control with Promises
```javascript
githubUser.control('gitUserInfo', function(Scope, GithubUserService) {
 Scope.data = GithubUserService.getById('magnumjs');
//OR
 return GithubUserService.getById('magnumjs').done(function(data) {
   Scope.id = data.id;
 });
});
```
[Try it out] (http://jsbin.com/kubilate/edit)

## State persistence
```javascript
myApp.factory('ListService', function() {
  var ListService = {};
  var list = [];
  ListService.getItem = function(index) { return list[index]; }
  ListService.addItem = function(item) { list.push(item); }
  ListService.removeItem = function(item) { list.splice(list.indexOf(item), 1) }
  ListService.size = function() { return list.length; }
  return ListService;
});
  
myApp.control('myCtrl',function(Scope,ListService){
  Scope.test='Who ';
  ListService.addItem({me:'me'});
});
  
myApp.control('myCtrl',function(Scope,ListService){
  Scope.test=Scope.test+ListService.getItem(0).me;
});
```

[Try it out] (http://jsbin.com/uGugOKo/edit)
## Todo Application
[Todos Example] (http://jsbin.com/temid/edit)
