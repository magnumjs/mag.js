<a href="//github.com/magnumjs/mag.js">
<img alt="Mag.JS - Elegant DOM Bindings" src="https://cloud.githubusercontent.com/assets/5196767/7222868/53794478-e6e5-11e4-886c-40c2a3512654.png"/>
</a>

### Intuitive, fast, clean, simple, clear, tiny, JS2HTML component templating library.

* Changes to state are immediately reflected in the dom by their element matchers.
* No virtual/shadow dom or new templating language! Super fast & 3.5KB Gzipped!
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
  view: function(state) {
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

Hello world (proxy support/Firefox since v0.7.4+, polyfill object.observe since v0.8.6):
http://jsbin.com/badabiqigu/edit?js,output

Hello array lifecycle event:
http://jsbin.com/magumodacu/edit?js,output

Count:
http://jsbin.com/reyacokico/edit?js,output

List: 
http://jsbin.com/yiseyuyuqu/edit?js,output

More lists: 
http://jsbin.com/ruzoyakene/edit?js,output

Sortable List:
http://jsbin.com/taducutoru/edit?js,output

Tiny filter:
http://jsbin.com/hukukaxije/edit?js,output

Filter list:
http://jsbin.com/lojobiqudi/edit?js,output

Filter list sort:
http://jsbin.com/kodumalodo/edit?js,output

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
http://jsbin.com/bohuniquha/edit?js,output

Todos (expanded): 
http://jsbin.com/lukuwabaso/edit?js,output

Contacts:
http://jsbin.com/mixasihoye/edit?js,output

Async:
http://jsbin.com/yajugavibe/edit?js,output

###React 2 Mag
Navigation menu:
http://jsbin.com/patecaronu/edit?js,output

Timer:
http://jsbin.com/cujohoyuwo/edit?js,output

Real-time search:
http://jsbin.com/wuzovilaga/edit?js,output
Same with different code style - creative Mag.JS!
http://jsbin.com/yegibecumu/edit?js,output

FilterableProductTable (Thinking in React tutorial):
http://jsbin.com/bisobeyuci/edit?js,output

Weather App:
http://jsbin.com/matediqixo/edit?js,output

Comment Box:
http://jsbin.com/licerahipi/edit?js,output

Video tutorial: 
https://youtube.com/watch?v=QEnyWHSsMFg

###Angular 2 Mag
Order form:
http://jsbin.com/horuxanacu/edit?js,output

Navigation menu:
http://jsbin.com/kasuyupufa/edit?js,output

Switchable Grid:
http://jsbin.com/xuduluhivi/edit?js,output

Contact Manager application:
http://jsbin.com/jegasagemi/edit?js,output

Country App - JSON/Routing
http://jsbin.com/nuvixocuje/edit?js,output

##[Jasmine Specs](https://rawgit.com/magnumjs/mag.js/master/tests/specRunner.html)

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
  view: function(state, props, element) {
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
  view: function(state, props, element) {
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
  view: function(state, props, element) {
    var name1 = 'Yo!',
        name2 = 'Joe!'
    state.h2 = {
      _config: function(element, isNew, context, index) {
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
It receives 4 arguments:
* 1. is the element itself
* 2. is a boolean stating if this is attaching or not, first run is always true, subsequent executions are always false
* 3. context is an object that can be used to pass values to the method itself on every iterative call
  - a. one available sub method of context is onunload e.g. context.onunload = fun is called when the element is removed from the dom.
  - - context.onunload (configContext, node, xpath)
* 4. Index- the x path based index of the element

mag.redraw is required to be manually called here if the desire is to display the changed state to the dom immediately.
An alternative is to use mag.prop for the state variables. mag.prop on setter will call mag.redraw automatically.

### Simple API

#### mag.module ( domElementID, Object Literal ModuleDefinition, Optional Object Properties to pass, optional boolean toCLoneNode )
This is the core function to attach a object of instructions to a dom element

ModuleDefinition is the instructions it needs to have a view function:
```javascript
var component = {
  view:function(){
  }
}
```
view receives three arguments: state, props and element
* state is the object used to transpile the dom 
   - e.g. state.h1 ='Hello' converts the first h1 tag in the element to that value
* is the optional properties object passed to its mag.module definition
* element is the node itself whose ID was pass to its mag.module definition

returns a mag.prop promise function settergetter with a default value 
{_html : node.innerHTML}
which is updated to the latest on promise resolution

#### mag.redraw ()
inititate a redraw manually

#### mag.hookin (type, key, handler)
Allows for custom definitions, see examples below

#### mag.prop ( setter value)
Helper setter/getter which calls mag.redraw on every setter

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
```

```javascript
state.li = [1,2]
```

Will render
```html
<ul>
  <li class="item-template">1</li>
  <li class="item-template">2</li>
</ul>
```

###Lists of Objects
```html
<ul><li class="item-template">People: <b class="name"></b></li></ul>
```
```javascript
state.li = [{name:'Joe'},{name:'Bob'}]
```

Will render
```html
<ul>
  <li class="item-template">People: <b class="name">Joe</b>
  </li>
  <li class="item-template">People: <b class="name">Bob</b>
  </li>
</ul>
```
###Nested Lists
```html
<ul>
  <li class="item-template">Project: <b class="projectName"></b>
    <ul>
      <li class="doneBy">
        <name/>
      </li>
    </ul>
    <tasks/>
  </li>
</ul>
```
```javascript
state['item-template'] = [{
    projectName: 'house cleaning',
    doneBy: [{
      name: 'Joe'
    }, {
      name: 'Bob'
    }],
    tasks: ['wash', 'rinse', 'repeat']
  }, {
    projectName: 'car detailing',
    doneBy: [{
      name: 'Bill'
    }, {
      name: 'Sam'
    }],
    tasks: ['wash', 'rinse', 'repeat']
  }]
```
Will render
```html
<ul>
  <li class="item-template">Project: <b class="projectName">house cleaning</b>
    <ul>
      <li class="doneBy">
        <name>Joe</name>
      </li>
      <li class="doneBy">
        <name>Bob</name>
      </li>
    </ul>
    <tasks>wash</tasks>
    <tasks>rinse</tasks>
    <tasks>repeat</tasks>
  </li>
  <li class="item-template">Project: <b class="projectName">car detailing</b>
    <ul>
      <li class="doneBy">
        <name>Bill</name>
      </li>
      <li class="doneBy">
        <name>Sam</name>
      </li>
    </ul>
    <tasks>wash</tasks>
    <tasks>rinse</tasks>
    <tasks>repeat</tasks>
  </li>
</ul>
```
(JsBin Example)[http://jsbin.com/piriducice/edit?js,output]
  
####Attributes
_html, _text, _on[EVENT], _config->context.onunload

to not overwrite an existing attribute use: 

state.name._value = state.name._value + ''

event (e, index, node, data) default context is node

* index is the xpath index of the node -1
* data is the index data of the parent if in a list

####Events

Life cycle events in controller:

* willload (event, node)
* didload (event, node)
* willupdate (event, node)
* didupdate (event, node)
* onunload (node)

event.preventDefault() - will skip further execution and call any onunload handlers in the current module (includes inner modules and _config onunloaders that are currently  assigned)

controller -> this.willload
state.matcher._onclick = function(e, index, node, data) 

###Native events: parameters - 

* the event
* the x path based 0 index
* the node itself (default context)
* the data of the closest parent list item (In nested lists, the first parent with data).

##Config (DOM hookin)
_config (node, isNew, context, index)

Available on all matchers to hookin to the DOM 

arguments :

* node - the element itself

* isNew is true initially when first run and then is false afterwards

* context is a empty object you can use to pass to itself

   - context.onunload - will be attached to the current modules onunloaders and called if any lifecycle event triggers e.preventDefault()

* index is 0 based on xpath of the matcher

#### Mag.JS AddOns!
Tiny sub library of reusable simple tools

* router
* send ajax
* binds - automatic two way binding
* toggle visibility
* Reusable utilities (copy, merge .. )

#### Custom plugins

The ability to register handlers for attribute or value trans compilation.

For example, allow the attribute _className. Register a handler that on every definition will modify both the final attribute name and or the value.

```javascript
mag.hookin('attributes', 'className', function(data) {
  data.value = data.node.classList + ' ' + data.value
  data.key = 'class'
})
```

Other hookins such as key/node value etc.. Coming soon!

#### Notes

 * Since v0.7.4 optional native Proxy support allows for UI directional bingings to undefined elementMatchers, currently only supported by Firefox

* Since v0.8.5 native support use of Promise is required, polyfill as necessary.

* Since v0.8.6 Optional native support for Object.observe used or load a polyfill such as the below for more aggressive bindings - will work without as well or call mag.redraw() where necessary
```html
<script src="//rawgit.com/MaxArt2501/object-observe/master/dist/object-observe.min.js"></script>
```

###Inspired By & cloned from

[Mithril.js](http://lhorie.github.io/mithril/), [Fill.js](https://github.com/profit-strategies/fill),  [React.js](https://facebook.github.io/react/), [Angular.js](https://angularjs.org/), 
