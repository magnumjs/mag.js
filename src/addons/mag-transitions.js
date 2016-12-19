/*
Name: mag-transitions v0.1.0
Description: animate mag modules easily based on react-css-transition-group (https://github.com/react-component/css-transition-group)
Example: reusable modal with css transitions (https://github.com/tryolabs/react-examples/tree/master/modal)
Author: Michael Glazer
License: MIT
Requires: MagJS v0.23 & addons 0.22
Homepage: https://github.com/magnumjs/mag.js
(c) 2016
*/

//TODO: Placeholder, NOT WORKING YET!

/*
//Example: 
<div id="app">
  <div class="stub"></stub>
  <div id="example">
    <h1></h1>
    <button>Toggle Visibility to view CSS transitions</button>
  </div>
</div>

mag.module('app', {
  view: function(state, props){
  
  state.stub = mag.transitions({
    transitionName: 'anim',
    isVisible: props.isVisible,
    children: mag.create('example', {
      view: function(state, props){
      
        state.h1 = 'Hello!'
        state.button = function(){
          props.isVisible = !props.isVisible
        };
      }
    });
  });
  }
}, {isVisible: true});

*/

mag.transitions = function(props){

  var transitionName = props.transitionName;
  var children = props.children;
  
  //animation sequences
  
  var animate = {
    enter : function(node, begin, end){
    
    },
    leave: function(node, begin, end){
    
    }
  };
  
  //HoC
  
  var mod = {
    controller: function(){
    
      this.willgetprops= function(e, node){
        // if children visible add animation 'enter' mode
        //else 'leave' mode
      }
    },
    view: function(state, props){
      // wrap children
      state.div = props.isVisible ? children(props) : null;
    }
  };
  
  //vDOM
  
  var ele = document.createElement('div');
  var clone = ele.cloneNode();
  clone.className = 'container';
  ele.appendChild(clone);
  
  var par = mag.create(ele, mod);

  return par;
};

