/*
  <div id="filter">
    <h3>List filter example</h3>
    <input placeholder="Filter list by something" />
    <ul>
      <li>Person Name: <span class="name"></span>
      </li>
    </ul>
  </div>
*/


mag.module('filter', {
  controller: function(props) {

    this.search = mag.prop('')
    this.list = props.list

    this.filter = function(item) {
      return this.search() && 
      item.name.toLowerCase().indexOf(this.search().toLowerCase())>-1
    }.bind(this)

  },
  view: function(element, props, state) {
    state.input = {
      _oninput: mag.withProp('value', state.search)
    }

    state.li = state.list.filter(state.filter)
  }
}, {
  list: [{
    id: 1,
    name: "John"
  }, {
    id: 2,
    name: "Bob"
  }, {
    id: 2,
    name: "Mary"
  }]
})
