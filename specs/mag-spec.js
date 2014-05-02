describe("MagJS", function() {
  beforeEach(function() {});
  it("is defined", function() {
    expect(mag).toBeDefined();
  });
  describe("control", function() {
    var app, $html;
    beforeEach(function() {
      app = mag.module('app');
      $html = affix('#test div ul span');
      $html.find('span').text('[[hello]]');
    });
    it("alters html", function() {
      app.control('test', function(Scope) {
        Scope.hello = 'Hi!';
        Scope.todo = [];
        Scope.add = function() {

        };
      });
      expect($html.find('span')).toHaveText('Hi!');
    });
  });
  describe("factory and service", function() {
    it("has dependencies with dependecies", function() {
      var app = mag.module('app8');
      app.service('more', function() {
        return {
          prop: 1,
        }
      });
      app.service('other', function(more) {
        return {
          prop: more.prop,
        }
      });
      app.service('test', function(other, more) {
        return {
          prop: more.prop + other.prop,
        }
      });
      app.control('test', function(Scope, test) {
        expect(test.prop).toEqual(2);
      });
    });
    it("factory maintains state", function() {
      var app = mag.module('app7');
      app.service('test', function() {
        return {
          prop: false,
        }
      });
      app.control('test', function(Scope, test) {
        expect(test.prop).toEqual(false);
        test.prop = true;
      });
      app.control('test', function(Scope, test) {
        expect(test.prop).toEqual(true);
      });
    });
    it("inherits", function(done) {
      $html = affix('#gitUserInfo .ided');
      $html.find('.ided').text('[[id]] things[[id]]');
      var githubUser = mag.module('githubUserApp');
      githubUser.factory('GithubUser', function() {
        var GithubUser = function(data) {
          $.extend(this, {
            id: null,
            collection1: [],
            collection2: [],
            status: 'NEW',
            isNew: function() {
              return (this.status == 'NEW' || this.id == null);
            }
          });
          $.extend(this, data);
        };
        return GithubUser;
      });
      githubUser.service('GithubUserService', function(GithubUser) {
        this.getById = function(userId) {
          return $.get('specs/github.json?id=' + userId).then(
            function(response) {
              return new GithubUser(response);
            });
        };
      });
      githubUser.control('gitUserInfo', function(Scope, GithubUserService) {
        return GithubUserService.getById('magnumjs').then(function(data) {
          Scope.id = data.id;
        });
      });
      setTimeout(function() {
        expect($html.find('.ided').text()).toEqual('5196767 things5196767');
        done();
      }, 250);
    });
  });
  describe("create a module", function() {
    it("reuse a module by name", function() {
      var app1 = mag.module('app');
      var app2 = mag.module('app');
      expect(app1).toEqual(app2);
      var app3 = mag.module('appOther');
      expect(app1).not.toEqual(app3);
    });
    it("config a factory", function() {
      var app1 = mag.module('app');
      app1.factory('test', function() {
        var name = 'Default';
        return {
          sayHello: function() {
            return "Hello, " + name + "!"
          },
          setName: function(newName) {
            name = newName;
          }
        };
      });
      app1.config(function(test) {
        test.setName('Mike');
      });
      app1.control('test', function(Scope, test) {
        expect(test.sayHello()).toEqual('Hello, Mike!');
      });
    });
    it("uiEvents module click1", function() {
      //$html = affix('#myCtrl .id button[data-event-click="add"]+.test');

      $html = $('body').append('<div id="myCtrl"><span>[[greet]] [[first]]  [[last]]!</span>    <button data-event-click="add">Click</button>  </div>');

      $html.find('.test').text('[[othery]]');
      var app = mag.module('myApp');

      app.control('myCtrl', function(Scope, Api) {
        Scope.first = Api.getProjects().first;
        Scope.last = Api.getProjects().last;
      });
      app.service('Api', function() {
        this.getProjects = function() {
          return new Object({
            first: 'Mike',
            last: 'Glazer'
          });
        };
      });
      app.control('myCtrl', function(Scope) {
        Scope.greet = 'Hello';
        Scope.add = function() {
          this.clicks = this.clicks + 1 || 1;
          console.log('click' + this.clicks);
        };
      });

      //console.log(1);
      //$('button').click();
      expect($html.find('#myCtrl span').text()).toEqual('Hello Mike  Glazer!');
      //done();
      //console.log(2);

      // $('button').click();
      // $('button').click();

      $('body').find('#myCtrl').remove();
    });
    it("uiEvents module click", function(done) {
      $html = affix('#ctrl .id button[data-event-click="add"]+.test');
      $html.find('.test').text('[[othery]]');
      var event = mag.module('click');
      event.control('ctrl', function(Scope) {
        Scope.dude = 'test';
      });
      event.control('ctrl', function(Scope) {
        Scope.other = 'test';
        Scope.add = function() {
          Scope.othery = this.other;
          //alert('t');
          //console.log('inside', Scope);
          //Scope.id = 'erer';
        };
      });
      $('button').click();
      expect($html.find('.test').text()).toEqual('test');
      done();
    });
    it("uiEvents module", function() {
      $html = affix('#ctrl .id button[data-event="add2"]');

      //$('body').append('<div id="ctrl"><button data-event="add2"/></div>');
      var event = mag.module('click');
      event.control('ctrl', function(Scope, Event) {
        Scope.add2 = function() {
          alert('t');
        };
      });
      $('button').trigger('click');
    });
    it("inject module in another module", function() {
      var app1 = mag.module('app3');
      app1.factory('test2', function() {
        var name = 'Default';
        return {
          sayHello: function() {
            return "Hello, " + name + "!"
          },
          setName: function(newName) {
            name = newName;
          }
        };
      });
      // app1.control('ctrl', function(Scope, test2) {
      //   expect(test2.sayHello()).toEqual('test');
      // });
      var app2 = mag.module('app2', ['app3']);
      app2.service('test', function() {
        this.name = 'test';
      });
      app2.config(function(test2) {
        test2.setName('test');
      });
      app2.control('ctrl', function(Scope, test2) {
        expect(test2.sayHello()).toEqual('Hello, test!');
      });
    });
    it("with no arguments", function() {
      var $html = affix('#myCtrl .test');
      var app = mag.module('myApp', []);
      expect(app).toBeDefined();
      app.service('Api', function() {
        this.getProjects = function() {
          return new Object({
            first: 'Mike',
            last: 'Glazer'
          });
        }
      });
      app.control('myCtrl', function(Scope) {
        Scope.test = 'Yo';
      });
      app.control('myCtrl', ['Scope',
        function(Scope) {
          expect(Scope.test).toEqual('Yo');
        }
      ]);
      expect($html.find('.test').text()).toEqual('Yo');
    });
  });
});
