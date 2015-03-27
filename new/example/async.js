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
