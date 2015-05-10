/*
// every module must have a element ID
<div id="demo">
  <h2></h2>
</div>
*/

// parent module - main parent application container
var demo = {}

// called once on initialization
demo.controller = function(props){

}

// called on every change to the state object
demo.view=function(state, props){
  s.h2 = 'Hello MagJS!'
}

// default properties to pass in
var props= {

}

// initialize the application
mag.module('demo',demo, props)
