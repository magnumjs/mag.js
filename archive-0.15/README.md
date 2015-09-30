<a href="//github.com/magnumjs/mag.js">
<img alt="Mag.JS - Elegant DOM Bindings" src="https://cloud.githubusercontent.com/assets/5196767/7222868/53794478-e6e5-11e4-886c-40c2a3512654.png"/>
</a>

### Intuitive, tiny, fast, JavaScript 2 HTML component templating library.
<hr>
##Features

* Changes to state are immediately reflected in the dom by their element matchers. <a href="#performance">Super crazy fast</a> & 4KB Gzipped!
* Valid HTML templates - No virtual/shadow dom or new templating language!
* Semantic data binding - Use normal HTML as a template and a related module (plain JS object) as instructions for transpiling/interpolations.
* Module has a constructor, called once and a viewer called on every change to the state of that module.
* Collection rendering - No need for hand-written loops. Write templates as a part of the HTML, in plain HTML
* View logic in JavaScript - No crippled micro-template language, just plain JavaScript functions
* Native events & attributes, full life cycle events control, Hookin to modify and create custom attributes

##[Getting started](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/getting-started.md) ::: <a href="#examples">Examples</a> - <a href="#tutorials">Tutorials</a> - <a href="#simple-api">Api</a> - <a href="#jasmine-specs">Tests</a> - <a href="#performance">Performance</a>

<a href="http://www.youtube.com/watch?feature=player_embedded&v=xdjPez4oOTA
" target="_blank"><img src="http://img.youtube.com/vi/xdjPez4oOTA/0.jpg" 
alt="Mag.JS - Elegant DOM Bindings" width="774" height="480" border="10" /></a>


> *"There is no JavaScript code in the HTML and there is no HTML code in the JavaScript!"*

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

*View receives 2 arguments, "state" & "props"* 

1. <code>state</code> is the DOM element(s) we want to set - the element Matchers and their controls
  1. Any change to the <code>state</code> object will trigger a redraw of the view - it is observed.
2. <code>props</code> is what we want the DOM element(s) to be set to - the data
 2. If the <code>props</code> have changed a new view redraw will run if triggered.
 2. <code>props</code> is passed from the parent and is set by <code>mag.module()</code>
 
##Tutorials

* [Introduction Part1](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/intro-part1.md)
* [Introduction Part2](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/intro-part2.md)
* [Comments Components from React](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/react-comments-component.md)
* [Contacts Components from Mithril](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/contacts-components.md)
* [Video Instructions](https://www.youtube.com/watch?v=OIXfxZ3DSC8&list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)

###Hello world!

[JSBin](http://jsbin.com/nilizehuha/edit?js,output) - [Take 2](http://jsbin.com/gefanapuvi/edit?js,output) - [Take3](http://jsbin.com/leyuxohago/edit?js,output) - [Take 4](http://jsbin.com/boziqevuka/edit?js,output) - [Take 5](http://jsbin.com/bejizesebu/edit?js,output)


Initial html
```html
<div id="hello">
  <label>Name:</label>
  <input type="text" placeholder="Enter a name here" />
  <hr/>
  <h1>Hello <span class="name"></span>!</h1>
</div>
```
Module:

```javascript
mag.module("hello", {
  view: function(state) {
    state.input = {
      _oninput: function() {
        state.name = this.value
      }
    }
  }
})
```

##Examples
[Boilerplate JSbin](http://jsbin.com/xadinepimo/edit) - [Boilerplate Plunker](http://embed.plnkr.co/Rk9IsJqEjtKPrCSLsFs5/preview) - [Boilerplate Plunker Modular](http://embed.plnkr.co/aGr60lPkHgUdkMO9ew4n/preview)

[Hello world](http://jsbin.com/nenotoluvo/edit?js,output)
(since v0.6.1, auto redraw called on event - mag.prop not necessary) 
[Hello world, take2](http://jsbin.com/zuquqavoni/edit?js,output)

[Basic Math: addition (proxy)](http://jsbin.com/rivolaciri/edit?html,js,output) - 
[Basic Math: addition (no proxy)](http://jsbin.com/bonivejivu/edit?html,js,output) -  [Take 3](http://jsbin.com/dajewaqule/edit?html,js,output) - [Take 4](http://jsbin.com/gabumocijo/edit?html,js,output) - [V0.12 auto wiring](http://jsbin.com/regofazoza/edit?html,js,output) - [Video tutorial](http://youtu.be/OIXfxZ3DSC8) - [Nested data auto wiring](http://jsbin.com/nidimuvayu/edit?html,js,output)

[Auto wiring - select menu](http://jsbin.com/rayotexedi/edit?js,output)

[Simple messaging component example](http://jsbin.com/biharowaba/edit?js,output) - [Video tutorial](https://www.youtube.com/watch?v=WLSNbSOk1CY) - [Take 2, w/Reusable child component](http://jsbin.com/bapafacava/edit?js,output)

[Hello world with passFail reusable component:]
(http://jsbin.com/situranusa/edit?js,output)

[Hello world (proxy support/Firefox since v0.7.4+, polyfill object.observe since v0.8.6):]
(http://jsbin.com/badabiqigu/edit?js,output)

[Hello array lifecycle event:]
(http://jsbin.com/xomajizame/edit?js,output)

[Count:]
(http://jsbin.com/wipaxiguce/edit?js,output)

[List:] 
(http://jsbin.com/tefitefotu/edit?js,output)

[More lists:]
(http://jsbin.com/ruzoyakene/edit?js,output)

[Sortable List:]
(http://jsbin.com/taducutoru/edit?js,output)

[Tiny filter:]
(http://jsbin.com/hukukaxije/edit?js,output)

[Filter list:]
(http://jsbin.com/lojobiqudi/edit?js,output)

[Filter list sort:]
(http://jsbin.com/kodumalodo/edit?js,output)

[Filter list components:]
(http://jsbin.com/tuduzapecu/edit?js,output)

[Quiz](http://jsbin.com/xuzavunaci/2/edit?js,output)

[Forms - passFail component](http://jsbin.com/cuxijarihi/edit?js,output)

[Form & list - model - comps - boilerplate](http://embed.plnkr.co/BAQQ0vOOK4StAefYaK02/preview)

[Tab component:]
(http://jsbin.com/payewiqasi/edit?js,output) - [Take2](http://jsbin.com/jutuvukiwe/edit?html,js,output)

[Modal component:]
(http://jsbin.com/kemowayego/edit?js,output)

[Modal with select menu:]
(http://jsbin.com/vihudibabe/edit?js,output)

[Forms - composable components - link manager](http://jsbin.com/cipezuyusu/edit?js,output)

[Todos:]
(http://jsbin.com/bihubarogi/edit?js,output) [Take2](http://jsbin.com/rafemapivi/edit?js,output) - [Take3](http://jsbin.com/yutedisesa/edit?html,js,output)

[Todo proxy (firefox)]
(http://jsbin.com/bohuniquha/edit?js,output)

[Todos (expanded):]
(http://jsbin.com/lukuwabaso/edit?js,output)

[Contacts:]
(http://jsbin.com/mixasihoye/edit?js,output) - [Take 2](http://jsbin.com/diwevicibe/edit?js,output)

[Async:]
(http://jsbin.com/yajugavibe/edit?js,output)

[Async - Geo Location](http://jsbin.com/giquhayepe/edit?html,js,output)

###Mithril 2 Mag
[Rotate Links](http://jsbin.com/xadacatoke/edit?js,output)

[Pagination](http://embed.plnkr.co/9VjZ6807pXbu0GETgk1u/preview)

[Volunteer form application](http://embed.plnkr.co/L2AN3YYchOMdqLOB3hPI/preview)

[Ajax Github Api](http://jsbin.com/xamebitiye/edit)

###React 2 Mag
[Navigation menu:]
(http://jsbin.com/patecaronu/edit?js,output)

[Timer:]
(http://jsbin.com/zivexomesa/edit?html,output)

[TabList - key components](http://jsbin.com/kuwogajexi/edit?js,output)

[TabList module pattern - dynamic children keys](http://embed.plnkr.co/Gjuycl4GdTj2TJijmpjq/preview) - [Video Tutorial](https://www.youtube.com/watch?v=0XvXxw_S-fU&index=15&list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)

[Real-time search:]
(http://jsbin.com/wuzovilaga/edit?js,output)
[Same with different code style - creative Mag.JS!]
(http://jsbin.com/yegibecumu/edit?js,output)

[FilterableProductTable (Thinking in React tutorial):]
(http://jsbin.com/bisobeyuci/edit?js,output)

[Occlusion culling](http://embed.plnkr.co/AgTYMqKi5JkYpHFxymGX/preview)

[Tab state (From Why React is Awesome)](http://embed.plnkr.co/zI0gNs6ijxcSUQTuM377/preview)

[Weather App:]
(http://jsbin.com/matediqixo/edit?js,output) [Take 2](http://jsbin.com/zihuwelete/edit?js,output)

[Comment Box:]
(http://jsbin.com/licerahipi/edit?js,output) - [Video tutorial:]
(https://youtube.com/watch?v=QEnyWHSsMFg) - [Take1](http://jsbin.com/tejabayowa/edit?js,output),
[Take 2](http://jsbin.com/davapupufo/edit?js,output) - [Take3 - MagJS v0.14](http://embed.plnkr.co/ViPC0XAYYhmePnuUCorD/preview) - [Module Pattern](http://embed.plnkr.co/n2wbvc3jfutMZH1SO5LH/) [Video tutorial](https://www.youtube.com/watch?v=89TCVe0WyaI)

[Image app with AJAX](http://embed.plnkr.co/fQzaidtY4GvsKH2k2Dtq/preview)

###Angular 2 Mag
[Order form:]
(http://jsbin.com/horuxanacu/edit?js,output)

[Navigation menu:]
(http://jsbin.com/kasuyupufa/edit?js,output)

[Switchable Grid:]
(http://jsbin.com/seyadifimu/edit?js,output)

[Contact Manager application:]
(http://jsbin.com/wepihedota/edit?js,output) - [Take 2](http://jsbin.com/wevazabiwi/edit?js,output)

[Country App - JSON/Routing]
(http://embed.plnkr.co/LnwflR8PD6AvvD0AZwfE/preview)

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
http://jsbin.com/juvisawici/edit?js,output

Example with config and without controller 

```javascript
mag.module("lister", {
  view: function(state) {
    var name1 = 'Yo!',
      name2 = 'Joe!'
    state.h2 = {
      _config: function(node, isNew) {
        if (isNew) {
          state.span = name1
          state.item = [1, 2, 3]
        }
      },
      _onclick: function() {
        state.item.reverse()
        state.span = state.span == name1 && name2 || name1;
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

#### mag.redraw (optional force Boolean)
inititate a redraw manually

Optional boolean argument to force cache to be cleared

#### mag.hookin (type, key, handler)
Allows for custom definitions, see examples [below](//github.com/magnumjs/mag.js/blob/master/README.md#custom-plugins)

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

```javascript
// A data store
var name = mag.prop('')

// binding the data store in a view
state.input = { _oninput: mag.withProp('value', name), _value: name() }
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
[JsBin Example](http://jsbin.com/piriducice/edit?js,output)
  
####Attributes
_html, _text, _on[EVENT], _config->context.onunload

to not overwrite an existing attribute use: 

state.name._value = state.name._value + ''

event (e, index, node, data) default context is node

* index is the xpath index of the node -1
* data is the index data of the parent if in a list (map{path,data,node,index})

####Events

Life cycle events in controller:

* willload (event, node)
* didload (event, node)
* willupdate (event, node)
* didupdate (event, node)
* isupdate (event, node)
* onunload (event, node)
* onreload (event, node)

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

Tiny sub library of reusable simple tools can be found [here](//github.com/magnumjs/mag.js/blob/master/src/mag.addons.js)

* router
* send ajax
* binds - automatic two way binding
* toggle visibility
* Reusable utilities (copy, merge .. )

There are two useful methods available in the comps

####mag.comp (templateComponentId, moduleDefinition, defaultProps, booleanToCloneNode)

It takes the same arguments as mag.module except it doesn't execute instead sends a reference function that can be executed with over writes to the template id, props and clone

[Get it here](//github.com/magnumjs/mag.js/blob/master/src/mag.comps.js)

```javascript
// wrapper function for mag.module
var CommentsComponent = mag.comp("CommentBox", CommentBox, props);
CommentsComponent({props:'to me'})
```
This allows you wrap your module definition in a resuable reference with defaults and over writing

####mag.namespace (String namespace, [Optional object Context])

```javascript
//module library creation with single global namespace / package names
(function(namespace) {
  var mod = {
    controller:function(props){
    },
    view: function(state, props) {
    }
  }
  namespace.CommentBox = mod;
})(mag.namespace('mods.comments'));


var CommentsComponent = mag.comp("CommentBox", mag.mod.comments, props);
CommentsComponent()
```

Allows you to easily add new namespaces to your composable components, useful in the module pattern.

[Example of component Module Pattern](http://embed.plnkr.co/n2wbvc3jfutMZH1SO5LH/) - [Video tutorial](https://www.youtube.com/watch?v=89TCVe0WyaI)

#### Custom plugins

The ability to register handlers for attribute or value trans compilation.

For example, allow the attribute _className. Register a handler that on every definition will modify both the final attribute name and or the value.

```javascript
mag.hookin('attributes', 'className', function(data) {
  var newClass = data.value
  data.value = data.node.classList + ''
  if (!data.node.classList.contains(newClass)) {
    data.value = data.node.classList.length > 0 ? data.node.classList + ' ' + newClass : newClass
  }
  data.key = 'class'
})
```

The above is in the [MagJS addons library](//github.com/magnumjs/mag.js/blob/master/src/mag.addons.js)

**Another example**

Hookin when a specific elementMatcher is not found and return a set of element matches

```javascript
// hookin to create an element if does not exist at the root level
mag.hookin('elementMatcher', 'testme', function(data) {
  // data.key, data.node, data.value

  var fragment = document.createDocumentFragment(),
    el = document.createElement('div');
    
  el.setAttribute('class', data.key)
  fragment.appendChild(el);

  var nodelist = fragment.childNodes;
  data.node.appendChild(fragment)

  data.value = nodelist
})
```

Other hookins such as key/node value etc.. Coming soon!

#### Notes

 * Since v0.7.4 optional native Proxy support allows for UI directional bingings to undefined elementMatchers, currently only supported by Firefox (removed in 0.14.9)

* Since v0.8.5 native support use of Promise is required, polyfill as necessary see below

* Since v0.8.6 Optional native support for Object.observe used or load a polyfill such as the below for more aggressive bindings


```html
<script src="//rawgit.com/MaxArt2501/array-observe/master/array-observe.min.js"></script>
<script src="//cdn.rawgit.com/MaxArt2501/object-observe/master/dist/object-observe.min.js"></script>
```

* Promise support for IE

```html
<!--[if IE]><script src="https://cdn.rawgit.com/jakearchibald/es6-promise/master/dist/es6-promise.min.js"></script><![endif]-->
```


###Performance
[JSBin](http://jsbin.com/momuxogicu/edit?js,output)

[JSPerf v0.14.4](http://jsperf.com/angular-vs-knockout-vs-ember/690)  
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/690"><img src="https://cloud.githubusercontent.com/assets/5196767/9841719/7b46329a-5a71-11e5-8ab2-2f4a1120d949.png"/></a>

[JSPerf v0.14.9](http://jsperf.com/angular-vs-knockout-vs-ember/695)
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/695"><img src="https://cloud.githubusercontent.com/assets/5196767/9858046/62a28128-5aec-11e5-86c0-03bc34268cbc.png"/></a>

[JSPerf v0.15](http://jsperf.com/angular-vs-knockout-vs-ember/694)
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/694"><img src="https://cloud.githubusercontent.com/assets/5196767/9859912/e0e29834-5af6-11e5-8bc1-c9b467d3fd25.png"/></a>

[JSPerf v0.15.1](http://jsperf.com/angular-vs-knockout-vs-ember/700)
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/700"><img src="https://cloud.githubusercontent.com/assets/5196767/9866345/60295bf4-5b2f-11e5-8c51-a73e47c7ac2c.png"/></a>

###Inspired By & cloned from

[Mithril.js](http://lhorie.github.io/mithril/), [Fill.js](https://github.com/profit-strategies/fill),  [React.js](https://facebook.github.io/react/), [Angular.js](https://angularjs.org/), 
