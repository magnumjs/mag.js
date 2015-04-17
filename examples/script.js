// descriptive todos example - no shortcuts
var todos = {}

todos.controller = function(props) {

  this.todoItem = mag.prop([])

  this.add = function(text) {
    var item = {
      text: text,
      _completed: false,
      _onclick: function(e) {
        var index = [].indexOf.call(document.querySelectorAll('.todoItem'), e.target.parentNode)
        this.todoItem()[index]._completed = !this.todoItem()[index]._completed
      }.bind(this),
      _config: function(node, isNew, context) {
        context.onunload = function() {
          console.log('unloaded')
        }
        node.querySelector('input').checked = node.getAttribute('completed') == 'true' ? true : false
      }
    }
    this.todoItem().push(item)
  }.bind(this)

  this.remains = function() {
    return this.todoItem().filter(function(item) {
      return item._completed == false
    }).length
  }.bind(this)

  this.archive = function() {
    this.todoItem(this.todoItem().filter(function(item, index) {
      if (!item._completed) {
        return item
      }
    }))
  }.bind(this)
}

todos.view = function(element, props, state) {

  var todo = mag.prop(''),
    doAdd = function(e) {
      if (todo() == '') return
      state.add(todo())
      e.target.value = todo('')
    }

  state.remaining = state.remains()
  state.size = state.todoItem().length + ' remaining'

  state.total = {
    a: {
      _onclick: state.archive
    },
    _class: "total " + (state.todoItem().length > 0 ? 'show' : 'hide'),
  }

  if (state.remains() == 0 && state.todoItem().length > 0) {
    state.total._text = 'Done!'
    state.remaining = {
      _class: "remaining hide"
    }
    state.size = '';

  } else {
    state.remaining = {
      _class: "remaining",
      _text: state.remains() + ' of '
    }
    state.total._text = ''
  }

  state.input = {
    _onfocus: function() {
      this.value = ''
    },
    _value: todo(),
    _onchange: mag.withProp('value', todo),
    _onkeyup: function(e) {
      if (e.which == 13) {
        doAdd(e)
      }
    }
  }

  state.button = {
    _onclick: doAdd
  }
}

mag.module("todos", todos)

// simple nested/reuse module examples

var passFail = {}

passFail.view = function(element, props, state) {

  state.message = props.pass() ? props.message.pass : props.fail() ? props.message.fail : ""

  state._class = props.pass() ? 'success' : props.fail() ? 'error' : ''

  state.messaging = state.message
}

var build = {}
build.view = function(element, props, state) {
  var link = function() {
    var scripts = document.querySelectorAll('head script')
    var string = ''
    for (var k in scripts) {
      var url = scripts[k].src
      if (!url) continue

      string += 'file=' + url + '&'
    }
    return 'http://reducisaurus.appspot.com/js?' + string
  }()

  state.a = {
    _target: 'blank',
    _href: link
  }
}


var app = {}

app.controller = function(props) {

  this.show = mag.prop(true)
  this.name = '?'
  this.onload = utils.onload
  this.pass = mag.prop("")
  this.fail = mag.prop("")

  this.change = function() {
    this.show() ? this.pass(true) : this.fail(true) && this.pass('')
    this.show(!this.show())
  }.bind(this)
}

app.view = function(element, props, state) {
  state.test = {
    _class: 'test ' + (state.show() ? 'show' : 'hide'),
    _html: 'Hello'
  }

  state.b = mag.module('build', build)

  state.message = mag.module('passFail2', passFail, {
    pass: state.pass,
    fail: state.fail,
    message: {
      pass: "yay!",
      fail: "boo!"
    }
  })

  state.button = {
    _onclick: state.change
  }
  setTimeout(function() {
    state.name = 'world'
  }, 1000)
}

var utils = {}
utils.onload = function(element) {
  element.classList.remove("hide")
}

mag.module("test", app, {
  prop: true
})
