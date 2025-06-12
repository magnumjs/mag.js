## Mag.JS - Stateless Components

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called "props") and return elements describing what should appear on the screen.

## Getting started

The easiest way to try out Mag.JS is to include it from a CDN, and follow this tutorial.

Let's create an HTML file to follow along:

```html
<body></body>
<script src="//raw.githack.com/magnumjs/mag.js/master/mag-latest.min.js"></script>
<script>
var root = document.body

// your code goes here!
</script>
```
[Example](http://jsbin.com/tubafuhepu/edit?html,output)

## Hello World

Let's start as small as well can: render some text on screen. Copy the code below into your file (and by copy, I mean type it out - you'll learn better)

```javascript
//Component:
var Hello = function(){
  return "Hello world"
}

//Attach:
var HelloComp = mag(root, Hello);

//Run:
HelloComp();
```
[Example](http://jsbin.com/damazuwopo/edit?html,output) - [With props](http://jsbin.com/vonamutano/edit?html,output) - [Simple syntax](http://jsbin.com/pomolafeli/edit?html,output)

Now, let's change the text to something else. Add this line of code under the previous one:

```javascript
var App = function(){
  return "My first app"
}
```
[Example](http://jsbin.com/wixopufafa/edit?html,output)

As you can see, you use the same code to both create and update HTML. Mag.JS automatically figures out the most efficient way of updating the text, rather than blindly recreating it from scratch.

## DOM Elements

Let's wrap our text in an `<h1>` tag.

```javascript
{h1: "Hello world"}
```
[Example](http://jsbin.com/migukexede/edit?html,output) - [Simple syntax](http://jsbin.com/famuxuyebo/edit?html,output) - [With props](http://jsbin.com/wadogayijo/edit?html,output)

**Element Matchers**

The component has the instructions for which html element matchers within our module element we want to interpolate and to what.

Element Matchers are the instructions of the component. Preferably, only attach dynamic values that will be matched to html and via props for componentization.

There are 5 ways to reference an element within a module:
* class name
* tag name
* data-bind attribute value
* id
* or name attribute value

## Props
When Mag.JS sees an element representing a user-defined component, it passes attributes to this component as a single object.
We call this object "props".

For example, this code renders "Hello, Mike" on the page:

```javascript
//Component:
function Welcome(props) {
  return {h1: 'Hello, '+props.name};
}

//Attach:
var WelcomeComp = mag(root, Welcome);

//Run:
WelcomeComp({name: 'Mike'});
```
[Example](http://jsbin.com/xukidaxive/edit?html,output)


## Composing Components

Components can refer to other components in their output. 
This lets us use the same component abstraction for any level of detail. 
A button, a form, a dialog, a screen: in Mag.JS apps, all those are commonly expressed as components.

For example, we can create an App component that renders Welcome many times:

```javascript
//Component:
function Welcome(props) {
  return {h1: 'Hello, '+props.name};
}

function App(){
  return {div: [
      Welcome({name:"Sara"}),
      Welcome({name:"Cahal"}),
      Welcome({name:"Edite"})
    ]
  }
}
  
//Attach:
var WelcomeComp = mag('body', App);

//Run:
WelcomeComp();
```
[Example](http://jsbin.com/tuyimabogi/edit?html,output) - [With template](http://jsbin.com/bekadoyuki/edit?html,output) - [Reusable cloning](http://jsbin.com/zoyadivaku/edit?html,output) - [Child parent templates](http://jsbin.com/zuziwiqato/edit?html,output) - [Simple Syntax](http://jsbin.com/kayidapiwu/edit?html,output)

**Notes**

- For nested stateless templates lists do NOT use IDs. 
- IDs should be unique and they are not manipulated in any way similarly to statefull components/modules.
- You must also pass a unique `key` in props when creating unique clones.
- Four fields are attached to the stateless function: `id, key, element and props`.
---

**Further Reading**

* [Compositional inheritance tutorial](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/compositional-inheritance.md)
* [Component children](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/component-children.md)
* [More Articles](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/README.md)

<hr>

**Examples**

*Lists*

- [List of nested stateless templates](http://jsbin.com/zaqabaludo/edit?html,output)
- [Stateless within statefull](http://jsbin.com/vubojilaqi/edit?html,output)
- [Dynamic List](http://jsbin.com/fudataguso/edit?html,output)


*State interaction*

- [Interaction with state](http://jsbin.com/lazegucafu/edit?html,output) 
- [Reusing modules uniquely](http://jsbin.com/najalimoko/edit?html,output) 
- [With template](http://jsbin.com/tawovoliju/edit?html,output)

*No state events*

- [Pure rendering](http://jsbin.com/simikupayu/edit?html,output) 
- [Toggle button deeply nested](https://codepen.io/anon/pen/XaeWYd?editors=1010)
- [Async nested components](http://jsbin.com/becucovasa/edit?html,output)
- [Fadein FadeOut](http://jsbin.com/tuzenusaka/edit?html,output)

*Composition*

 - [Composable nested](http://jsbin.com/gisacucogu/edit?js,output)
 - [Component List Composition](http://jsbin.com/ledujezige/edit?js,output)
 - [Loading Spinner](http://jsbin.com/yipopogibu/edit?js,output)
