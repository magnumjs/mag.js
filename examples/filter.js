/*
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

    this.term = props.searchText || mag.prop('')
    this.list = props.list
    this.binds = props.binds || mag.prop()

    this.search = function(value) {
      this.term(value.toLowerCase())
    }.bind(this)

    this.filter = function(item) {
      return this.term() && item.name.toLowerCase().indexOf(this.term()) > -1
    }.bind(this)

  },
  view: function(state, props, element) {
    state.input = {
      _oninput: mag.withProp('value', state.search)
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
    this.searchTextProject = mag.prop('')

    this.usersFilter = mag.module('filter-users', filter, {
      list: users,
      binds: this.selectedUser
    })

  },
  view: function(state, props, element) {

    state.users = state.usersFilter

    state.projects = mag.module('filter-projects', filter, {
      searchText: state.searchTextProject,
      list: projects,
      binds: state.selectedProject
    })

  }
})

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

/*
mag.module('filter', {
  controller: function(props) {
    this.willload = function(event, element) {
      element.querySelector('ul').classList.remove('hide')
    }
    this.term = mag.prop('')
    this.list = props.list

    this.search = function(value) {
      this.term(value.toLowerCase())
    }.bind(this)

    this.filter = function(item) {
      return this.term() && item.name.toLowerCase().indexOf(this.term().toLowerCase()) > -1
    }.bind(this)

  },
  view: function(state, props, element) {
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
*/
/*
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
*/
