/*
  <div id="filter">
    <h3>List filter example</h3>
    <input placeholder="Filter list by something" />
    <ul class='hide'>
      <li>Person Name: <span class="name"></span>
      </li>
    </ul>
  </div>
*/


mag.module('filter', {
  controller: function(props) {
    this.onload=function(element){
      element.querySelector('ul').classList.remove('hide')
    }
    this.term = mag.prop('')
    this.list = props.list

    this.search = function(value) {
      this.term(value.toLowerCase())
    }.bind(this)

    this.filter = function(item) {
      console.log(this.term())
      return this.term() && item.name.toLowerCase().indexOf(this.term().toLowerCase()) > -1
    }.bind(this)

  },
  view: function(element, props, state) {
    state.input = {
      _oninput: mag.withProp('value', state.search)
    }

    state.li = state.list.filter(state.filter)
    console.log(state.li)
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
