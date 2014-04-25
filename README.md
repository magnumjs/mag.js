MagJS
======

###Magnum JavaScript

###MAG = Modular Application Glue

####Simple dependency injection module, service, factory, control, config, directives - DOM modeling

[Jasmine Specs] (https://rawgit.com/magnumjs/mag.js/master/index.html)

Include the script into your page:
#### HTML Script TAG
```html
<script type="text/javascript" src="//rawgit.com/magnumjs/mag.js/master/dist/mag.full-0.2.min.js"></script>
```

# Examples

## Create a Module:

Factory, Service, Control
#### Define a Module
they are inheritable and reusable
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
They can be injected with factories. Use the [] style arguments when minifying
```javascript
      githubUser.service('GithubUserService', function(GithubUser) {
        this.getById = function(userId) {
          return $.get('github.json?id=' + userId).then(
            function(response) {
              return new GithubUser(response);
            });
        };
      });
```
#### Define a control
They can be injected with services or factories.
They relay data to the view via the 'Scope' first argument
```javascript
      githubUser.control('gitUserInfo', function(Scope, GithubUserService) {
        GithubUserService.getById('magnumjs').done(function(data) {
          Scope.id = data.id;
        });
      });
```
[Try it out] (http://jsbin.com/hopokibi/edit)


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

<!-- <a href="http://plnkr.co/edit/zNI2IPbnd1P9omp9LcP6?p=preview">Plunker</a>
-->
<!--
<a class="jsbin-embed" href="http://jsbin.com/esovum/1/embed?live">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>
-->
