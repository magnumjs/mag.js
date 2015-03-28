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
}

app.view = function(element, props, state) {
  state.test = {
    _class: 'test ' + (state.show() ? 'show' : 'hide'),
    _html: 'Hello',
  }
// nested
  state.b = mag.module('build', build)
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
