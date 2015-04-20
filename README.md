<a href="">
<img alt="Mag.JS - Elegant DOM Bindings" src="https://cloud.githubusercontent.com/assets/5196767/7222868/53794478-e6e5-11e4-886c-40c2a3512654.png"/>
</a>

### Intuitive, fast, clean, simple, clear, tiny, JS2HTML component templating library.

* Changes to state are immediately reflected in the dom by their element matchers.
* No virtual/shadow dom or new templating language! Super fast & 5KB Gzipped!
* Use normal HTML as a template and a related module (plain JS object) as instructions for transpiling/interpolations.
* Module has a constructor, called once and a viewer called on every change to the state of that module.
* provides intuitive, clear helpers and shortcuts for dom templating, arrays, matchers, eventing, onload, offload, configuration hookins etc...

<a href="http://www.youtube.com/watch?feature=player_embedded&v=xdjPez4oOTA
" target="_blank"><img src="http://img.youtube.com/vi/xdjPez4oOTA/0.jpg" 
alt="Mag.JS - Elegant DOM Bindings" width="774" height="480" border="10" /></a>

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
##Examples

Hello world:
http://jsbin.com/nenotoluvo/edit?js,output
(since v0.6.1, auto redraw called on event - mag.prop not necessary) 
http://jsbin.com/zuquqavoni/edit?js,output

Hello world with passFail reusable component:
http://jsbin.com/takatohoxo/edit?js,output

Hello world (proxy support/Firefox v0.7.4+):
http://jsbin.com/dubobayigo/edit?js,output

Count:
http://jsbin.com/reyacokico/edit?js,output

List: 
http://jsbin.com/yiseyuyuqu/edit?js,output

More lists: 
http://jsbin.com/ruzoyakene/edit?js,output

Sortable List:
http://jsbin.com/taducutoru/edit?js,output

Filter list:
http://jsbin.com/lojobiqudi/edit?js,output

Filter list components:
http://jsbin.com/xigipeziqi/edit?js,output

Tab component:
http://jsbin.com/payewiqasi/edit?js,output

Modal component:
http://jsbin.com/beqimijebo/edit?js,output

Modal with select menu:
http://jsbin.com/vihudibabe/edit?js,output

Todos:
http://jsbin.com/bihubarogi/edit?js,output

Todo proxy (firefox)
http://jsbin.com/qogiqufisu/edit?js,output

Todos (expanded): 
http://jsbin.com/lukuwabaso/edit?js,output

Contacts:
http://jsbin.com/mixasihoye/edit?js,output

Async:
http://jsbin.com/yajugavibe/edit?js,output

###React 2 Mag
Navigation menu:
http://jsbin.com/basefakoda/edit?js,output

Timer:
http://jsbin.com/cujohoyuwo/edit?js,output

###Angular 2 Mag
Order form:
http://jsbin.com/horuxanacu/edit?js,output

Navigation menu:
http://jsbin.com/wibelacipe/edit?js,output

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
http://jsbin.com/yigoleyemu/edit?js,output

You can see that the first one when clicked nothing is changed while the second is dynamic.
The reasons is simply because the controller is called once while the view is called on every redraw/action/state change.

Here's an alternative approach to the above that only uses a view method and no controller for a similar result:
http://jsbin.com/dafozijaje/edit?js,output

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

state.$h1 will match all h1s - greedy matcher, default only selects the first

To change the class for an element

```javascript
This: <h1></h1>
With: state.h1 = { _class: 'header', _text : 'Hello!'} 
Makes: <h1 class="header">Hello!</h1>
```j
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

####Attributes
_html, _text, _on[EVENT], _config->context.onunload

to not overwrite an existing attribute use: 

state.name._value = state.name._value + ''

event (e, index, node) default context is node

####Events
controller ->this.onload
_onclick ..

##Config (DOM hookin)
_config (node, isNew, context, index)

context.onunload

#### Mag.JS AddOns!
Tiny sub library of reusable simple tools

* router
* send ajax
* binds
* toggle visibility

#### Mixins (coming soon!)

#### Custom plugins (coming soon!)

The ability to register handlers for attribute or value trans compilation.

For example, allow the attribute _className register a handler that on every definition will modify both the final attribute name and or the value.

```javascript
mag.registerAttr('className',function(data){

  var originalAttribute=data.attribute
  var node =data.node
  var originalValue =data.value

  return {
    attribute:'class',
    value :  node.getAttribute('class')+' '+originalValue
  }

})
```
