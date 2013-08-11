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

mag.control('todosControl', ['test', todosControl]);
$('.todos').addClass('more');
//$('.todos input').after('[[test]]');
setTimeout(function () {
    mag.control('todosControl', ['',
        function ($scope) {
            $scope.test = 'momma';
            $scope.todos[0].done = false;
        }
    ]);
    console.log($('.todos:eq(0) span').attr('class'));
}, 1000);
