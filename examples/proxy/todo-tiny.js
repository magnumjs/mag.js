// http://jsbin.com/bohuniquha/edit

var todo = {};

todo.controller = function(props) {
  this.todoList = props.todoList;

  // For non proxy suport - i.e. not Firefox
  // this.form = mag.addons.binds(this);

  this.clicked = function(state) {
    this.todoList = this.todoList.filter(function(x, i) {
      if (state.$done[i]._checked) return false;
      return true;
    });
  }.bind(this);

};

todo.view = function(element, props, state) {

  state.$todoList = {
    _config: function(node, isNew, context, index) {
      node.children[0].checked = false; //onload all are unchecked
      node.classList.toggle('done', state.todoList[index].done);
    },
    _onclick: function(e, index, node) {
      this.classList.toggle('done');
    }
  };

  state.button = {
    _onclick: state.clicked.bind(null, state)
  };

  state.add = {
    _onclick: function() {
      state.todoList.push({
        todoText: state.todoInput
      });
      return false;
    }
  };
};

var props = {
  todoList: [{
    todoText: 'Clean House'
  }]
};

mag.module("todo", todo, props);
