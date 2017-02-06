# Introduction

- [What is Mag.JS?](#what-is-magjs)
- [Getting started](#getting-started)
- [Hello world](#hello-world)
- [DOM elements](#dom-elements)
- [Components](#components)
- [Routing](#routing)
- [XHR](#xhr)

---

### What is Mag.JS?

Mag.JS is an simple intuitive Javascript library for component templating.  
It's small (< 7kb gzip), fast and provides routing and XHR utilities out of the box ([Addons](https://github.com/magnumjs/mag.js/blob/master/src/addons/README.md)).

Mag.JS is used for quickly prototyping UI templates. It focuses on the clean and unobtrusive separation of HTML and JavaScript. 
While keeping the interaction between the two effortless and fun!
---

### Getting started

The easiest way to try out Mag.JS is to include it from rawgit, and follow this tutorial. 
It'll cover the majority of the API surface (including routing and XHR) but it'll only take 10 minutes.

Let's create an HTML file to follow along:

```html
<body></body>
<script src="//rawgit.com/magnumjs/mag.js/master/mag-latest.min.js"></script>
<script>
var root = document.body

// your code goes here!
</script>
```
[Example](http://jsbin.com/deyozubafa/edit?html,output)
---

### Hello world

Let's start as small as well can: render some text on screen. Copy the code below into your file (and by copy, I mean type it out - you'll learn better)

Let's wrap our text in an `<h1>` tag.

```html
<body>
  <h1></h1>
</body>
```

```javascript
var root = document.body

mag.module(root, {view: (state)=> state.h1 = "Hello world" })
```
[Example](http://jsbin.com/vixerohumu/edit?html,output)

Now, let's change the text to something else. Add this line of code under the previous one:

```javascript
state.h1 = "My first app"
```
[Example](http://jsbin.com/sadavemeri/edit?html,output)

As you can see, you use the same code to both create and update HTML. 
Mag.JS automatically figures out the most efficient way of updating the text, rather than blindly recreating it from scratch.

---

### DOM elements

Let's wrap our text in an `<h1>` tag template.

```javascript
mag.module(root, {view: (state)=> {
  state.placeholder = mag('template', {
    view: (state)=> state.h1 = 'My first app'
  })
 }
})
```
[Example](http://jsbin.com/pidicezeki/edit?html,output)

The `mag()` function can be used to reference any HTML element you want. Either by its element ID or the Node itself:
The main difference between `mag` and `mag.module` is that `mag` uses the template indirectly while `mag.module` uses it directly.

```javascript
mag(document.getElementById('template'), {
  view: (state)=> state.h1 = 'My first app'
})
```

The `state` Object can be used to describe any HTML structure you want. So if you to add a class to the `<h1>`:

```javascript
state.h1 = { _class: "title", _text: "My first app" }
```
A leading underscore denotes a property/attribute. The `_text` and `_html` are used as expected.
[Example](http://jsbin.com/sezoquyafe/edit?html,output)

If you want to have multiple elements:

```javascript
state.li = [
	{h1: { _class: "title", _text: "My first app"}},
	{button: "A button"}
]
```
Any array of items will automatically create the same amount for the matching selectors.
[Example](http://jsbin.com/ruvogaloka/edit?html,output)

And so on:

```javascript
state.main = {li: [
	{h1: {_class: "title"}, _text: "My first app"},
	{button: "A button"}
]}
```
[Example](http://jsbin.com/retafokuko/edit?html,output)

Note: If you prefer external templates you can do that too, [it's possible via an extension](https://github.com/magnumjs/mag.js/tree/master/src/extends).

```javascript
//Syntax via mag.template extends
mag.module('template.html', {view: ()});
mag('template.html', {view: ()});

mag.module({templateUrl: 'template.html', view: ()});
mag({templateUrl: 'template.html', view: ()});
```

**Element Matchers**

The component has the instructions for which html element matchers within our module element we want to interpolate and to what.

Element Matchers are the instructions of the component. Preferably, only attach dynamic values that will be matched to html and via props for componentization.

There are 5 ways to reference an element within a module:
* class name
* tag name
* data-bind attribute value
* id
* or name attribute value

---

### Components

A Mag.JS component is just an object with a `view` function. Here's the code above as a component:

```javascript
var Hello = {
	view: function(state) {
		state.main = [
			{h1: {_class: "title", _text: "My first app"}},
			{button: "A button"}
		]
	}
}
```

To activate the component, we use `mag.module`.

```javascript
mag.module(root, Hello)
```

As you would expect, doing so results in this markup:

```html
<main>
	<h1 class="title">My first app</h1>
	<button>A button</button>
</main>
```

The `state` object is Proxied, and instead of rendering some HTML only once, it activates Mag.JS's auto-redrawing system. 
To understand what that means, let's add some events:

```javascript
var count = 0 // added a variable

var Hello = {
  view: function(state) {
    state.main = {
      h1: {_class: "title", _text: "My first app"},
      // changed the next line
      button: {_onclick: () => count++, _text: count + " clicks"}
    }
  }
}
```
[Example](http://jsbin.com/nuvequmiwi/edit?html,output)

*With state*
```javascript
var Hello = {
  view: function(state) {
    state.count = state.count || 0 // added a variable
    state.main = {
      h1: {_class: "title", _text: "My first app"},
      // changed the next line
      button: {_onclick: () => state.count++, _text: state.count + " clicks"}
    }
  }
}

mag.module(root, Hello)
```
[With state](http://jsbin.com/peluxitibi/edit?html,output)

We defined an `onclick` event on the button, which increments a variable `count` (which was declared at the top). We are now also rendering the value of that variable in the button label.

You can now update the label of the button by clicking the button. Since we used `mag.module`, you don't need to manually call `mag.redraw` to apply the changes in the `count` variable to the HTML; Mag.JS does it for you.

If you're wondering about performance, it turns out Mag.JS is very fast at rendering updates, because it only touches the parts of the DOM it absolutely needs to. So in our example above, when you click the button, the text in it is the only part of the DOM Mag.JS actually updates.

[Stateless Components](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/stateless-components.md) are useful when constructing the UI.

---

### Routing
([Addons](https://github.com/magnumjs/mag.js/blob/master/src/addons/README.md))

Routing just means going from one screen to another in an application with several screens.

Let's add a splash page that appears before our click counter. First we create a component for it:

```javascript
var Splash = {
	view: function(state) {
		state.a = {_href: "#!/hello", _text: "Enter!"}
	}
}
```

As you can see, this component simply renders a link to `#!/hello`. The `#!` part is known as a hashbang, and it's a common convention used in Single Page Applications to indicate that the stuff after it (the `/hello` part) is a route path.

Now that we are going to have more than one screen.

```javascript
mag.route.addRoute('', Splash);
mag.route.addRoute('/hello', Hello);

mag.route.start();
```

The `mag.route` function still has the same auto-redrawing functionality that `mag.module` does, and it also enables URL awareness; in other words, it lets Mag.JS know what to do when it sees a `#!` in the URL.

The `"/splash"` right after `root` means that's the default route, i.e. if the hashbang in the URL doesn't point to one of the defined routes (`/splash` and `/hello`, in our case), then Mag.JS redirects to the default route. So if you open the page in a browser and your URL is `http://localhost`, then you get redirected to `http://localhost/#!/splash`.

Also, as you would expect, clicking on the link on the splash page takes you to the click counter screen we created earlier. Notice that now your URL will point to `http://localhost/#!/hello`. You can navigate back and forth to the splash page using the browser's back and next button.

---

### XHR
([Addons](https://github.com/magnumjs/mag.js/blob/master/src/addons/README.md))

Basically, XHR is just a way to talk to a server.

Let's change our click counter to make it save data on a server. For the server, we'll use [REM](http://rem-rest-api.herokuapp.com), a mock REST API designed for toy apps like this tutorial.

First we create a function that calls `mag.request`. The `url` specifies an endpoint that represents a resource, the `method` specifies the type of action we're taking (typically the `PUT` method [upserts](https://en.wiktionary.org/wiki/upsert)), `data` is the payload that we're sending to the endpoint and `withCredentials` means to enable cookies (a requirement for the REM API to work)

```javascript
var count = 0
var increment = function() {
	mag.request({
		method: "PUT",
		url: "http://rem-rest-api.herokuapp.com/api/tutorial/1",
		data: {count: count + 1},
		withCredentials: true,
	})
	.then(function(data) {
		count = parseInt(data.count)
	})
}
```

Calling the increment function [upserts](https://en.wiktionary.org/wiki/upsert) an object `{count: 1}` to the `/api/tutorial/1` endpoint. This endpoint returns an object with the same `count` value that was sent to it. Notice that the `count` variable is only updated after the request completes, and it's updated with the response value from the server now.

Let's replace the event handler in the component to call the `increment` function instead of incrementing the `count` variable directly:

```javascript
var Hello = {
	view: function(state) {
		state.main = {
			h1: {_class: "title", _text: "My first app"},
			button: {_onclick: increment, _text: count + " clicks"},
		}
	}
}
```
[Example](http://jsbin.com/pahukirido/edit?html,output) - [With state](http://jsbin.com/jokanaweze/edit?html,output)

Clicking the button should now update the count.

---

We covered how to create and update HTML, how to create components, routes for a Single Page Application, and interacted with a server via XHR.

This should be enough to get you started writing the frontend for a real application. Now that you are comfortable with the basics of the Mag.JS API, [be sure to check out the simple application tutorial](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/simple-application.md), which walks you through building a realistic application.

Learn more about the basic building blocks in Mag.JS such as 
[Stateless Components](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/stateless-components.md)
