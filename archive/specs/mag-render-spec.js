var $scope = {};
$scope.test = 'Yo!';
$scope.remaining = function() {
  return 1;
};
$scope.todos = [{
  text: 'first',
  done: true
}, {
  text: 'second',
  done: false
}, {
  text: 'third',
  done: false
}];
describe("MagJS Template", function() {
  it("is defined", function() {
    expect(mag.render).toBeDefined();
  });
  describe("when called", function() {
    var $html;
    beforeEach(function() {
      $html = affix('#todosControl span.test+ul.todo>li.todos>input[type="checkbox"]+span.message+span.remaining');
      $html.find('.test').append('[[test]] [[remaining]]');
      $html.find('.message').addClass('completed-[[done]]').text('[[text]]');
    });
    it("reuse a module by name", function() {
      var app1 = mag.module('app');
      var app2 = mag.module('app');
      expect(app1).toEqual(app2);
      var app3 = mag.module('appOther');
      expect(app1).not.toEqual(app3);
    });
    it("won't run non existent controller container", function() {
      var $html = affix('#test span');
      $html.find('span').text('[[name]]');
      var app = mag.module('appTest');
      app.control('testFake', function(Scope) {
        Scope.name = 'Joe';
      });
      expect($html.html()).not.toHaveText('Joe');
    });
    it("config a factory", function() {
      //affix('#test');
      var app = mag.module('app');
      app.control('test', function(Scope) {});
    });
    it("overwrites children a factory", function() {
      $html = affix('#ctrl .id button[data-event="add"]');

      var event = mag.module('click1');
      event.control('ctrl', function(Scope) {
        Scope.id = 'test';
      });

      expect($html.html()).toEqual('<div class="id">test</div>');
    });
    it("uiEvents module 1", function() {
      $html = affix('#ctrl .id button[data-event-click="add"]+.test');
      $html.find('.test').text('[[othery]]');
      var event = mag.module('click',[]);
      event.control('ctrl', function(Scope) {
        Scope.other = 'test';
        Scope.add = function() {
          Scope.othery = this.other;
          //console.log(Scope);
        };
      });
      $('button').click();
      expect($html.find('.test').text()).toEqual('test');
    });
    it("uiEvents module", function() {
      $html = affix('#ctrl .id button[data-event="add"]+.test');
      $html.find('.test').text('[[other]]');
      var event = mag.module('click');
      event.control('ctrl', function(Scope) {
        Scope.other = 'test';
        Scope.add = function() {
          Scope.other = this.other;
        };
      });
      $('button').click();
      expect($html.find('.test')).toHaveText('test');
    });
    it("fires on control", function() {
      var app = mag.module('myTApp',[]);
      expect(app).toBeDefined();
      app.control('todosControl', function(Scope) {

        Scope.test = 'Yo!';
        Scope.remaining = function() {
          return 1;
        };
        Scope.todos = [{
          text: 'first',
          done: true
        }, {
          text: 'second',
          done: false
        }, {
          text: 'third',
          done: false
        }];
      });
      // app.control('todosControl', ['Scope',
      //   function(Scope) {
      //     expect(Scope.test).toEqual('Yo!');
      //   }
      // ]);
      //console.log($html.html());
      expect($html.find('.test').text()).toEqual('Yo!');
      expect($html.find('li:eq(0) .remaining').text()).toEqual('1');
      expect($html.find('li:eq(0) .message').attr('class')).toEqual('message completed-true');
    });
    it("change scope in reusable module", function() {
      expect($html).toContainHtml('[[test]]');
      var app = mag.module('myTApp');
      app.control('todosControl',
        function(Scope) {
          Scope.test = 'YoYo!';
        });
      expect($html.find('.test').text()).toEqual('YoYo!');

    });
    it("parses control id node with Scope data", function() {
      expect($html).toContainHtml('[[test]]');
      var app = mag.module('myTApp', []);
      app.control('todosControl',
        function(Scope) {
          Scope.remaining = function() {
            return 1;
          };
          Scope.test = 'YoYo!';
        });
      expect($html.find('.test').text()).toEqual('YoYo!');
      //expect($html.find('.message')).toHaveLength(3);
      // expect($html.find('.message').eq(0)).toHaveClass('completed-true');
      // expect($html.find('.message').eq(1)).toHaveClass('completed-false');
      // expect($html.find('.todos')).toHaveLength(3);
      expect($html).toContainHtml('<div id="todosControl"');
    });
  });
});
