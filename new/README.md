#MagNumJS (Mag.JS) v2

##Tiny real dom intuitive templating

###leveraging fill.js,watch.js and mithril.js module architecture

* No virtual/shadow dom or new templating language! Super fast & under 5KB Gzipped!
* Use normal HTML as a template and a related module (plain JS object) as instructions for transpiling/interpolations.
* Module has a constructor, called once and a viewer called on every change to the state of that module.

```javascript
Initial dom:
<div id="hello">
  <h1></h1>
</div>

Module:
mag.module('hello', {
  view: function(element, props, state) {
    state.h1 = 'Hello Mag.JS!'
  }
})

Mag.JS dom!:
<div id="hello">
  <h1>Hello Mag.JS!</h1>
</div>
```
Hello world Example:
http://jsbin.com/gotuziboho/edit?js,output
(since v0.6.1, auto redraw called on event - mag.prop not necessary) 
http://jsbin.com/fagutuhedu/edit?js,output

Hello world example with passFail reusable component:
http://jsbin.com/tokufazaki/edit?js,output

Count example:
http://jsbin.com/fiheweteje/edit?js,output

List example: 
http://jsbin.com/kamugipufu/edit?js,output

More lists: 
http://jsbin.com/fisugeniko/edit?js,output

Sortable List:
http://jsbin.com/lomujimusa/edit?js,output

Filter list:
http://jsbin.com/fabuwitapi/edit?js,output

Filter list components:
http://jsbin.com/noliteragi/edit?js,output

Tab component example:
http://jsbin.com/qoyavejama/edit?js,output

Modal component example:
http://jsbin.com/jiyoforowa/edit?js,output

Modal with select menu:
http://jsbin.com/rocugoqeka/edit?js,output

Todos Example: 
http://jsbin.com/dabiqamapo/edit?js,output

Contacts Example:
http://jsbin.com/lasoluteju/edit?js,output

Async Example:
http://jsbin.com/hubawibaqu/edit?js,output

###Statefullness
When redrawing the view method is called.
To maintain statefulness we can use the controller method.
Plainly these are default values.

HTML for below examples:
```html
<div id="lister">
  <h2></h2>
  <ul>
    <li class="item"></li>
  </ul>
</div>
```

Example without controller
```javascript
mag.module('lister', {
  view: function(element, props, state) {
  state.item = [1, 2, 3]
  state.title = 'Lister'
    state.h2 = {
      _text: state.title,
      _onclick: function() {
        state.show = state.show ? !state.show : true
        state.item.reverse()
        state.title = 'Gister' + state.show
      }
    }
  }
})
```
Example with controller
```javascript
mag.module('lister', {
  controller: function(props) {
    this.item = [1, 2, 3]
    this.title = 'Lister'
  },
  view: function(element, props, state) {
    state.h2 = {
      _text: state.title,
      _onclick: function() {
        state.show = state.show ? !state.show : true
        state.item.reverse()
        state.title = 'Gister' + state.show
      }
    }
  }
})
```

This link displays both for comparison:
http://jsbin.com/siyafopodi/edit?js,output

You can see that the first one when clicked nothing is changed while the second is dynamic.
The reasons is simply because the controller is called once while the view is called on every redraw/action/state change.

Here's an alternative approach to the above that only uses a view method and no controller for a similar result:
http://jsbin.com/dotajezate/edit?js,output

Example with config and without controller 

```javascript
mag.module("lister", {
  view: function(element, props, state) {
    var name1 = 'Yo!',
        name2 = 'Joe!'
    state.h2 = {
      _config: function(element, isNew, context) {
        if (isNew) {
          state.span = name1
          state.item = [1, 2, 3]
          mag.redraw()
        }
      },
      _onclick: function() {
        state.item.reverse()
        state.span = state.span == name1 && name2 || name1
      }
    }
  }
})
```
This is similar to using a controller or onload.
Every element has a _config to act as onload for hookins.
It receives 3 arguments:
* 1. is the element itself
* 2. is a boolean stating if this is attaching or not, first run is always true, subsequent executions are always false
* 3. context is an object that can be used to pass values to the method itself on every iterative call
  - a. one available sub method of context is onunload e.g. context.onunload = fun is called when the element is removed from the dom.

mag.redraw is required to be manually called here if the desire is to display the changed state to the dom immediately.
An alternative is to use mag.prop for the state variables. mag.prop on setter will call mag.redraw automatically.

### Simple API

#### mag.module ( domElementID, Object Literal, Optional Object Properties to pass )
This is the core function to attach a object of instructions to a dom element

#### mag.prop ( setter value)
Helper setter/getter which calls mag.redraw on every setter

#### mag.redraw ()
inititate a redraw manually

#### mag.withProp (propName, functionToCall)
Helper utility to add a property to a function such as mag.prop
e.g. 
```javascript
state.input = { 
_oninput : mag.withProp ( 'value', mag.prop | functionToCallWithValueOfPropAsFirstArgument )
}
```

### state object

State is the object that is watched for changes and is used to transpile the related dom parent element ID

there are 5 ways to reference an element within a module
* class name
* tag name
* data-bind name
* id
* or name attribute

state.h1 will match the first h1 element within a module (element id or parent node)

```javascript
This: <h1></h1>
With: state.h1 = 'Hello!'
Makes: <h1>Hello!</h1>
```

state.$h1 will match all h1s

To change the class for an element

```javascript
This: <h1></h1>
With: state.h1 = { _class: 'header', _text : 'Hello!'} 
Makes: <h1 class="header">Hello!</h1>
```
_text and _html are used to fill an elements text node and not as an attribute below.

any prefix underscore will be an attribute except for _on that will be for events such as 
```javascript
state.h1 = { _onclick: function() { state.h1='clicked!' } } 
```

#### Lists

Dealing with lists are simple and intuitive, including nested lists.

The first list element is used as the template for all new items on the list
For example:
```html
<ul><li class="item-template"></li></ul>

state.li = [1,2]

Will generate
<ul><li class="item-template">1</li><li class="item-template">2</li></ul>
```
