/*
<style>
.done {
   text-decoration: line-through;
  color: grey;
}
</style>
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

  this.remove = function() {
    this.todoList = this.todoList.filter(function(x) {
      if (x.done) return false;
      return true;
    });
  }.bind(this);

  this.addTo = function(e) {
    this.todoList.push({
      todoText: this.todoInput, // non firefox - e.target.parentNode.children[0].value,
      done: false
    });
    return false;
  };
};

todo.view = function(element, props, state) {

  state.$todoList = {
    _config: function(node, isNew, context, index) {
      node.children[0].setAttribute('index', index);
      node.children[0].checked = state.todoList[index].done;
      node.classList.toggle('done',node.children[0].checked);
    },
    _onclick: function(e) {
      var index = e.target.getAttribute('index');
      state.todoList[index].done = e.target.checked;
      e.target.parentNode.classList.toggle('done');
    }
  };

  state.add = {
    _onclick: state.addTo.bind(state)
  };
  state.button = {
    _onclick: state.remove
  };
};

var props = {
  todoList: [{
    todoText: 'Clean House',
    done: false
  }]
};

mag.module("todo", todo, props);
