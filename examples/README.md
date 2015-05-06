#Getting Started
##What is MagJS?

MagJS is a very simple and intuitive javascript templating library.

It provides the ability to easily hook into html elements from your javascript code.

It is only 4kb gzipped and has a tiny api that is tightly focused on only doing what it is desgined for.

You can use MagJS as a thin layer to prototype and template your html via javascript.

It does not put html code in your JS and it does not put JS code in your html.

There is no special templating syntax or special JS way in which to code.
<hr/>

##Download
```html
<script src="//rawgit.com/magnumjs/mag.js/master/mag.min.js"></script>
```

##A Simple Application
Getting started is fairly trivial.

[Boilerplate JSBin](http://jsbin.com/giquhokari/edit?html,output)

```html
<!doctype html>
<title>Todo app</title>
<script src="//rawgit.com/magnumjs/mag.js/master/mag.min.js"></script>
<script>
//app goes here
</script>
```

```javascript
//an empty MagJS component
var myComponent = {
    controller: function() {},
    view: function() {}
}
```
##Model/service

Typically, model entities are reusable and live outside of components (e.g. var User = ...). 
They can be seen as services to your data (find, getAll, save ..) not the presentation of it.

```javascript
var todo = {}

todo.Todo = function(data) {
    this.description = mag.prop(data.description);
    this.done = mag.prop(false);
};

//the TodoList class is a list of Todo's
todo.TodoList = Array;
```

mag.prop is simply a factory for a getter-setter function. Getter-setters work like this:

```javascript
//define a getter-setter with initial value `John`
var a_name = mag.prop("John");

//read the value
var a = a_name(); //a == "John"

//set the value to `Mary`
a_name("Mary"); //Mary

//read the value
var b = a_name(); //b == "Mary"
```

Note that the Todo and TodoList classes we defined above are plain vanilla Javascript constructors. They can be initialized and used like this:
```javascript
var myTask = new todo.Todo({description: "Write code"});

//read the description
myTask.description(); //Write code

//is it done?
var isDone = myTask.done(); //isDone == false

//mark as done
myTask.done(true); //true

//now it's done
isDone = myTask.done(); //isDone == true
```

## View model

The view model layer is plain HTML. Note the ID is used to attach to the mag.module the element that we will use our javascript element matchers to transpile with.


This exists on the HTML page your JS is loaded on, it does not exist anywhere unnaturally such as in JavaScript.

```html
<div id="todos">
  <input>
  <button>Add</button>
  <ol>
    <li class="list">
      <label class="checkbox">
        <input class="check" type="checkbox" />
        <span class="description"></span>
      </label>
    </li>
  </ol>
</div>
```
Transpilation is the conversion of the JavaScript object to HTML.


We can break apart this html component into at least two separate ones within our parent module.

1. the add button and input as a "add todo form"

2. the list of our todos

For this simple example we will only use the parent module.

##Module definition

A mag.module defines the control and transpilation that should occur in the html element.

```javascript
mag.module('todos',todo)
```

This attaches our component definition JS object to the element we want to manipulate. 

All inner elements can be used by the state to match and add values e.g.

```javascript
view:function(state){
  state.button = 'Add todo!'
}
```
This will change the value or text of the button.

To attach an event and change the text:

```javascript
view:function(state){
  state.button = {
    _text : 'Add todo!',
    _onclick : function(e){}
  }
}
```
All attributes are denoted by a leading underscore "_"

## View object
The todos object is plain javascript that contains our component. The view's "state" is what maintains our updates to the DOM as values and or events.

```html
<h2></h2>
```
```javascript
//here's the view
todo.view = function(state) {
  // assign a dynamic value to the html
  // data should flow via props to the state
  state.h2='My Todos!'
}
```

```html
<h2>My Todos!</h2>
```

The component has the instructions for which html element matchers within out module element we want to transpile and to what.

Element Matchers are the "state" of the component. Preferably, only attach dynamic values that will be matched to html and via props for componentization.

There are 5 ways to reference an element within a module
* class name
* tag name
* data-bind name
* id
* or name attribute

##Data bindings

Fortunately, bindings can also be bi-directional: that is, they can be coded in such a way that, in addition to setting the DOM value, it's also possible to read it as a user types, and then update the description getter-setter in the view-model.

Here's the most basic way of implementing the view-to-model part of the binding:

```javascript
 state.input = {
    _onchange: mag.withProp("value", state.text)
  }
```

The code bound to the onchange can be read like this: "with the attribute value, set state.text".

##Flow control

To manipulate how the DOM will render our data list of objects we simply use javascript map function

```javascript
state.list = state.mylist.map(function(task) {

  var checked = {
    _onclick: mag.withProp("checked", task.done)
  }

  task.done() ? checked._checked = true : ""

  return {
    description: {
      _text: task.description(),
      _style: 'text-decoration: ' + (task.done() ? "line-through" : "none")
    },
    check: checked
  }

})
```
In the code above, the todo list is an Array, and map is one of its native functional methods. It allows us to iterate over the list and merge transformed versions of the list items into an output array.


##Summary

Here's the application code in its entirety:

```javascript
<!doctype html>
<script src="//rawgit.com/magnumjs/mag.js/master/mag.min.js"></script>

<div id="todos">
  <input>
  <button>Add</button>
  <ol>
    <li class="list">
      <label class="checkbox">
        <input class="check" type="checkbox" />
        <span class="description"></span>
      </label>
    </li>
  </ol>
</div>

<script>
//this application only has one component: todo
var todo = {};

//for simplicity, we use this component to namespace the model classes

//the Todo class has two properties
todo.Todo = function(data) {
  this.description = mag.prop(data.description);
  this.done = mag.prop(false);
};

//the TodoList class is a list of Todo's
todo.TodoList = Array;

// service helper for our model - can be attached to it's own namespace for re-usability
//adds a todo to the list, and clears the description field for user convenience
// can be defined in the controller or passed in as props
todo.handleAddTodo = function() {
  if (this.text()) {
    this.mylist.push(new todo.Todo({
      description: this.text()
    }));
    this.text("");
  }
}

//the view-model tracks a running list of todos,
//stores a description for new todos before they are created
//and takes care of the logic surrounding when adding is permitted
//and clearing the input after adding a todo to the list


//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
todo.controller = function() {
  return {
    //a running list of todos
    mylist: new todo.TodoList(),
  
    //a slot to store the name of a new todo before it is created
    text: mag.prop("")
  }
}

//here's the view
todo.view = function(state) {

  //Here's the most basic way of implementing the view-to-model part of the binding:
  state.input = {
    _onchange: mag.withProp("value", state.text)
  }

  //adds a todo to the list, and clears the description field for user convenience
  state.button = {
    _onclick: todo.handleAddTodo.bind(state)
  }

  // list mapping for element mathcer transpilations
  state.list = state.mylist.map(function(task) {
  
    var checked = {
      _onclick: mag.withProp("checked", task.done)
    }
  
    task.done() ? checked._checked = true : ""
  
    return {
      description: {
        _text: task.description(),
        _style: 'text-decoration: ' + (task.done() ? "line-through" : "none")
      },
      check: checked
    }
  })
}

//initialize the application
mag.module('todos', {controller: todo.controller,view: todo.view});
</script>
```

[Todo JSBin example](http://jsbin.com/xegejosuju/edit)

We are binding our list to the class list in the TR - more about lists here:

Lists should have their own container and they are the template for all preceding items.

###Coming soon:
Introductory section on Components
Introductory section on Lists

##Implementation Examples

## Implement automatic 2 way bindings

[Binding Example](http://jsbin.com/dicezageja/edit)

[Component Hierarchy 3 deep](http://jsbin.com/fosoladene/edit?html,js,output)

[Simple form with passFail component](http://jsbin.com/laraserije/edit?html,js,output)

###Notes

This works by Mag.js listening to changes to state
If and only if the state has changed will it rerun the view
On view load it is simply re running the bind method which then sets the defaults it has listed.

If would be nicer if it can be set in the controller
If it listened to any change and set it directly to that change
