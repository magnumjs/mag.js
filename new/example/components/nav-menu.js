/*
<style>
* {
    padding:0;
    margin:0;
}

html{
    font:14px normal Arial, sans-serif;
    color:#626771;
    background-color:#fff;
}

body{
    padding:60px;
    text-align: center;
}

ul{
    list-style:none;
    display: inline-block;
}

ul li{
    display: inline-block;
    padding: 10px 20px;
    cursor:pointer;
    background-color:#eee;
    color:#7B8585;
    
    transition:0.3s;
}

ul li:hover{
    background-color:#beecea;
}

ul li.focus{
    color:#fff;
    background-color:#41c7c2;
}

p{
    padding-top:15px;
    font-size:12px;
}
</style>
<div id="menu">
  <h2>Menu example</h2>
  <ul class="menuList">
    <li class="menuItem">
    </li>
  </ul>
  <p>
    Selected: <b></b>
  </p>
</div>
*/

// http://jsbin.com/hoqoyisolo/12/edit

// refactor from React Examples: http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/#Navigation menu

var menu = {};

menu.controller = function(props) {

  // Here we will read the items property, which was passed
  // as an attribute when the component was created


  // The map method will loop over the array of menu entries,
  // and will return a new array with <li> elements.

  this.menuItem = props.menuItem;
  this.focused = props.focused;
  this.clicked = function(e, index) {

    // The click handler will update the state with
    // the index of the focused menu entry

    this.focused = index;
  }.bind(this);

};

menu.view = function(element, props, state) {

  state.b = state.menuItem[state.focused];

  // Notice we DON'T need the use of the bind() method. It makes the
  // index available to the clicked function:

  state.$menuItem = {
    _config: function(node, isNew, context, index) {
     node.classList.toggle('focus', index === state.focused);
    },
    _onclick: state.clicked
  };

};

var props = {
  focused: 0,
  menuItem: ['Home', 'Services', 'About', 'Contact us']
};

// Render the menu component on the page, and pass an array with menu options

mag.module("menu", menu, props);
// 1. list of menu items
// 2. focused menu item default
// 3. on click focused menu item
