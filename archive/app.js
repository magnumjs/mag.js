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
// Code goes here
var todosControl = function ($scope) {
    //$scope.test= 'Yo!';
    $scope.todos = [{
        text: 'Integrate magnum',
        done: true
    }, {
        text: 'Leverage magnum into my app',
        done: false
    }];
    $scope.remaining = function () {
        var count = 0;
        $.each($scope.todos, function (k, todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };
    $scope.size = function () {
        return $scope.todos.length;
    };
}
mag.observe().on('tmpl-begin', function (name) {
    $('#' + name).hide();
});
mag.observe().on('tmpl-end', function (name) {
    if (name == 'todosControl') {
        $('#' + name).show();

        var ctrl = new mag.watch();
        ctrl.secret = 'null';
        ctrl._bind($('#todoText'), 'secret');
        ctrl._watch($('.output'), 'secret');

        // mag.observe().on('propertyChanged',function(prop,val){
        //   console.log(prop+'='+val);
        // });
    }
});

mag.control('todosControl', ['test', todosControl]);
$('.todos').addClass('more');
//$('.todos input').after('="[[test]]"');
setTimeout(function () {
    mag.control('todosControl', ['',
        function ($scope) {
            // $scope.test='momma';
            $scope.todos[0].done = false;
        }
    ]);

}, 1000);
