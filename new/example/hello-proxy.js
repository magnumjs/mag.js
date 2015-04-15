/*
http://jsbin.com/qukodubebo/edit?js,output
<div id="hello">
    <label>Name:</label>
    <input type="text" placeholder="Enter your name" />
    <hr/>
    <h1>Hello<span></span></h1>
  </div>
*/
var hello = {}
hello.controller = function(props) {
  this.span =  this.label
}
hello.view = function(element, props, state) {
  state.input = {
    _config: function(element, isNew, context) {
        if (isNew) {
          state.span = context.initial = ', ' + state.label.substring(0, state.label.length - 1) + '?'
        } else {
          if(!state.span) state.span = context.initial
        }
      },
    _oninput: function(e) {
      state.span = this.value ? ' ' + this.value + '!' :0
    }
  }
}

mag.module("hello", hello)
