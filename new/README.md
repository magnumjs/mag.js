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
http://jsbin.com/gevusowaja/edit?js,output

Hello world example with passFail reusable component:
http://jsbin.com/tejepeqafe/edit?js,output

Count example:
http://jsbin.com/mazepufuga/edit?js,output

List example: 
http://jsbin.com/cetitovosa/edit?js,output

More lists: 
http://jsbin.com/yolafodedu/edit?js,output

Tab component example:
http://jsbin.com/divewuxama/edit?js,output

Todos Example: 
http://jsbin.com/buvacomime/edit?js,output

Contacts Example:
http://jsbin.com/zumecayiva/edit?js,output

###Statefullness
When redrawing the view method is called.
To maintain statefulness we can use the controller method

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
http://jsbin.com/casabenibe/edit?js,output

You can see that the first one when clicked nothing is changed while the second is dynamic.
The reasons is simply because the controller is called once while the view is called on every redraw/action/state change.

### Simple API

#### mag.module ( domElementID, Object Literal, Optional Object Properties to pass )
This is the core function to attach a object of instructions to a dom element

#### mag.prop ( setter value)
Helper setter/getter which calls mag.redraw and every setter

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
