/*
http://jsbin.com/favibehoye/edit?html,js,output
  <div id="dashboard">
    <div id="filter-users">
      <h3>Filter users (<span data-bind="selectedUser"><name></name></span>)</h3>
      <input placeholder="Filter users by ... " />
      <ul>
        <li>Person Name: <span data-bind="name"></span>
        </li>
      </ul>
    </div>
    <div id="filter-projects">
      <h3>Filter projects (<span data-bind="selectedProject"><name></name></span>)</h3>
      <input placeholder="Filter projects by ... " />
      <ul>
        <li>Person Name: <span data-bind="name"></span>
        </li>
      </ul>
    </div>
  </div>
*/

var filter = {
  controller: function(props) {

    this.binds = props.binds || mag.prop()
    this.term = mag.prop(props.term || '')
    this.list = props.list || []

    this.filter = function(item) {
      return this.term() &&
        item.name.toLowerCase().indexOf(this.term().toLowerCase()) > -1
    }.bind(this)

  },
  view: function(state, props) {
    state.input = {
      _oninput: mag.withProp('value', state.term)
    }

    state.li = state.list.filter(state.filter).map(function(item) {
      return {
        _onclick: state.binds.bind(this, item),
        _text: item.name
      }
    })
  }
}

var users = [{
  id: 1,
  name: "John"
}, {
  id: 2,
  name: "Bob"
}, {
  id: 2,
  name: "Mary"
}]

var projects = [{
  id: 1,
  name: "John's project"
}, {
  id: 2,
  name: "Bob's project"
}, {
  id: 2,
  name: "Mary's project"
}]

mag.module('dashboard', {
  controller: function(props) {
    this.selectedProject = mag.prop('...')
    this.selectedUser = mag.prop('...')

    mag.module('filter-users', filter, {
      list: props.users,
      binds: this.selectedUser
    })
  },
  view: function(element, props, state) {

    mag.module('filter-projects', filter, {
      list: props.projects,
      binds: state.selectedProject
    })
  }
}, {
  users: users,
  projects: projects
})
