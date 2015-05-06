#Getting Started
##What is MagJS?

MagJS is a very simple and intuitive javascript templating library.

It provides the ability to easily hook into html elements from your javascript code.

It is only 4kb gzipped and has a tiny api that is tightly focused on onyl doing what it is desgined for.

You can use MagJS as a thin layer to prototype and template your html via javascript.

It does not put html code in your JS and it doe not put JS code in yoru JS.

There is no special templating syntax or special JS way in which to code.
<hr/>
##A Simple Application
Getting started is farily trivial.

[Boilerplate JSBin](http://jsbin.com/giquhokari/edit?html,output)

```html
<!doctype html>
<title>Todo app</title>
<script src="mag.min.js"></script>
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

The view model layer is plain HTML. Note the ID is used to attach to the mag.module the element that we will use our javascript element matchers to transpile data.

```html
<div id="todos">
  <input>
  <button>Add</button>
  <table>
    <tr>
      <td>
          <input type="checkbox">
      </td>
      <td></td>
    </tr>
  </table>
</div>
```

We can break apart this html component into at least two separate ones within our parent module.
1. the add button and input as a "add todo form"
2. the list of our todos

For this simple example we will only use the parent module.

##Module definition

A mag.module defines the control and trapilation that should occur in the html element.

```javascript
mag.module('todos',todos)
```

This attaches our component definition JS object to the element we want to manipulate. ALl inner elements can be used by the state to match and add values e.g.

```javascript
view;function(state){
  state.button = 'Add todo!'
}
```
This will change the value or text of the button.

To attach an event and change the text:

```javascript
view;function(state){
  state.button = {
    _text : 'Add todo!',
    _onclick : function(e){}
  }
}
```


The todos object is plain javascript that contains our component.

The component has the instructions of which html element mathcers within out module element we want to transpile and to what.

```javascript
var todos = {}
todos.view=function(state){

}
```


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
