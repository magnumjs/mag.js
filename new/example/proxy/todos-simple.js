/*
<div id="todo">
  <h2>Todo proxy example</h2>
  <form>
    <input name="todoInput" placeholder="Add New" />
    <input type="submit" name="add" value="Add New" />
  </form>
  <div class="list">
    <div class="todoList">
      <input name="done" type="checkbox" />
      <span data-bind="todoText"></span>
    </div>
  </div>
  <p>
    <button>Remove marked</button>
  </p>
</div>
*/

var todo = {};

todo.controller = function(props) {
  this.todoList = props.todoList;

  this.button = {
    _onclick: function(e) {
      this.todoList = this.todoList.filter(function(x, i) {
        if (x.done) return false;
        return true;
      });
    }.bind(this)
  };

};

todo.view = function(element, props, state) {

  state.$todoList = {
    _config: function(node, isNew, context, index) {
      node.children[0].setAttribute('index', index);
      node.children[0].checked = state.todoList[index].done;
    },
    _onclick: function(e) {
      var index = e.target.getAttribute('index');
      state.todoList[index].done = e.target.checked;
    }
  };

  state.add = {
    _onclick: function() {
      state.todoList.push({
        todoText: state.todoInput,
        done: false
      });
      return false;
    }
  };
};

var props = {
  todoList: [{
    todoText: 'Clean House',
    done: false
  }]
};

mag.module("todo", todo, props);
// 1. list of todos
// 2. add new todos
// 3. remove todos
