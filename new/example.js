var utils = {}
utils.onload = function(element) {
  element.classList.remove("hide")
}

var todos = {}

todos.controller = function(props) {

  this.todoItem = []

  this.onload = utils.onload

  this.add = function(text) {
    var item = {
      _onclick: function(index, e) {
        this.todoItem[index]._completed = e.target.checked
        mag.redraw()
      }.bind(this, this.todoItem.length),
      text: text,
      _completed: false
    }
    this.todoItem.push(item)
  }.bind(this)

  this.remains = function() {
    return this.todoItem.filter(function(item) {
      return item._completed == false
    }).length
  }.bind(this)

}

todos.view = function(element, props, state) {

  var todo = mag.prop(''),
    doAdd = function(e) {
      if (todo() == '') return
      state.add(todo())
      todo('')
      e.target.value = ''
    }

  state.remaining = state.remains()
  state.size = state.todoItem.length + ' remaining'

  state.total = {
    _class: "total " + (state.todoItem.length > 0 ? 'show' : 'hide'),
  }

  if (state.remains() == 0 && state.todoItem.length > 0) {
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

todos.controller.onload = function() {
  console.log('test')
}

mag.module("todos", todos)


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
  // console.log('ctrl call')

  this.show = mag.prop(true)
  this.name = '?'
  this.onload = utils.onload
}

app.view = function(element, props, state) {
  //console.log('view call')
  state.test = {
    _class: 'test ' + (state.show() ? 'show' : 'hide'),
    _html: 'Hello',
  }

  state.b = mag.module('build',build)
  state.button = {
    _onclick: function() {
      state.show(!state.show())
    }
  }
  setTimeout(function() {
    state.name = 'world'
  }, 1000)
}

mag.module("test", app, {
  prop: true
})
