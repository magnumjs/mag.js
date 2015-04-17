var todosControl = function (Scope) {
    Scope.todos = [{
        text: 'Integrate magnum',
        done: true
    }, {
        text: 'Leverage magnum into my app',
        done: false
    }];
    Scope.remaining = function () {
        var count = 0;
        $.each($scope.todos, function (k, todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };
    Scope.size = function () {
        return $scope.todos.length;
    };
};

var todosApp = mag.module('todos')
.control('todosControl', todosControl);
