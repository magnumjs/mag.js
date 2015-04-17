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
  // non proxy suport - i.e. not Firefox
  // this.form = mag.addons.binds(this);
  
  this.button = {
    _onclick: function() {
      this.todoList = this.todoList.filter(function(x) {
        if (x.done) return false;
        return true;
      });
    }.bind(this)
  };
};

todo.view = function(element, props, state) {

  state.$todoList = {
    _config: function(node, isNew, context, index) {
      node.children[0].checked = state.todoList[index].done;
      node.classList.toggle('done',state.todoList[index].done);
    },
    _onclick: function(e, index) {
      state.todoList[index].done = !state.todoList[index].done;
      this.classList.toggle('done');
    }
  };

  state.add = {
    _onclick: function() {
      state.todoList.push({
        todoText: state.todoInput, // use addon 'binds' or this|e.target.parentNode.children[0].value
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
// 4. toggle completed/done class
