
/*
<div id="todo">
  <h3>Proxy todo example</h3>
  <form>
    <input name="todoInput" placeholder="Add New"/>
    <input type="submit" name="add" value="Add New"/>
  </form>
  <div class="list">
    <div class="todoList">
      <input name="done" type="checkbox" />
      <span data-bind="todoText" />
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

  this.list = {
    _onclick: function(e) {
      var index = getNodeIndex(e.target);
      this.todoList[index].done = e.target.checked;
    }.bind(this)
  };

  this.addTo = function(e) {
    this.todoList.push({
      todoText: this.todoInput,
      done: false
    });
    return false;
  };

  this.remove = function(e) {
    this.todoList = this.todoList.filter(function(x, i) {
      if (x.done || (this.done._checked && i === 0) ||
        (this.$done[i] && this.$done[i]._checked)) {
        return false;
      }
      return true;
    }.bind(this));
  };
};

todo.view = function(element, props, state) {
  state.add = {
    _onclick: state.addTo.bind(state)
  };
  state.button = {
    _onclick: state.remove.bind(state)
  };
  state.$todoList = {
    _config: function(node, isNew, context, index) {
      node.children[0].checked = state.todoList[index].done;
    }
  };
};

var props = {
  todoList: [{
    todoText: 'Clean House',
    done: false
  }]
};

function getNodeIndex(node) {
  return [].indexOf.call(node.parentNode.parentNode.children, node.parentNode);
}

mag.module("todo", todo, props);
