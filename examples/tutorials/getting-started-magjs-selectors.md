# Getting Started with MagJS and Selectors

MagJS is an open source library for building user interfaces.
It lets you create views easily while making sure your UI stays in sync with the underlying data model.
This article, targeted towards beginners, covers the basics of MagJS and its selectors.

## Getting Started 
 
Probably, the easiest way to get started with MagJS, is to include the necessary libraries from one of the [boilerplates](https://github.com/magnumjs/mag.js#boilerplates) on GitHub.

To kick things off, let’s the simplest boilerplate [Blank](http://jsbin.com/tubafuhepu/edit?html,output):

Open the link and add the following:

```html
<body>
  <Greeting></Greeting>
</body>
<script src="//rawgit.com/magnumjs/mag.js/master/mag-latest.min.js"></script>
<script>
  
var Greeting = mag("Greeting", () =>
  {
    return "Hello, Universe"
  }
)

mag(
 document.body,
 Greeting()
)

</script>
```
[Try it on JSBin](http://jsbin.com/joqicejibe/edit?html,output)

Let’s have a look at what’s going on.

1. MagJS follows component oriented development. 
The general idea is to break your whole UI into a set of components. 
In our case we have just one component named `Greeting`. 
In MagJS, you create a component by calling `mag()`. Every component returns markup ["selectors"](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/build-with-magjs-tutorial-selectors.md) or ["element matchers"](https://github.com/magnumjs/mag.js#state-object) to render.
In the above snippet we simply returned `Hello, Universe`, which is then displayed in the view.

2. A component doesn’t do anything until it’s rendered. 
The first argument is the HTML element in which you would like to render your component.
It can be a live node or a string of its ID, className or tagName.
To render a component you call the function returned by `mag()` with the props to render as the first argument. 
In our case we render our Greeting component into the `<body>`.


## Introducing Properties

MagJS relies on unidirectional data flow.
This means that data flow occurs in only one direction i.e. from parent to child via properties.
These properties are passed to child components via props in Components.
Inside the component you can access the passed properties via the props property of the component.
When the properties change, MagJS makes sure to re-render your component so that your UI is up-to-date with the data model.
Let’s modify the previous snippet to show a random message every two seconds.

```js
var Greeting = mag("Greeting", (props)=>{
 return {p: props.message}
});

setInterval(function() {

  var messages = ['Hello, World', 'Hello, Planet', 'Hello, Universe'];
  var randomMessage = messages[Math.floor((Math.random() * 3))];
  
  var Greeter = mag(
   document.body,
   Greeting
  );
  
  Greeter({message: randomMessage});
  
}, 2000);
```
[Try it on JSBin](http://jsbin.com/padafirido/edit?html,output)

The above code chooses a random message from an array and re-renders our component every two seconds. 
The chosen message is passed as a property called message. 
You also need to use pair of curly braces {} to pass the variable. 
Now inside the Greeting component, we access the passed value via this.props.message.

If you run the above snippet, it will display a random message every two seconds (assuming a different message is chosen each time).

Just note that the passed props are immutable. 
You just pass various properties to a component via props. 
Inside the component you never write to this.props. 


## Introducing State and Events

In MagJS each component is encapsulated and maintains its own state (if stateful). A stateful component can store a value in its state and pass it to its child components via props. This ensures that whenever a component’s state changes, the props also change. As a result the child components that depend on these props re-render themselves automatically.

To reinforce this concept let’s modify our previous snippet so that a random message is displayed when a button is clicked. For this we will have two components:

RandomMessage: This is the parent component which maintains a randomly chosen message in its state.
MessageView: This is a child component which deals with displaying the randomly selected message.
Let’s take a look at each component in detail.
This keeps data flow unidirectional and it’s easier to understand how the data change affects the whole application.

### RandomMessage

```js
var RandomMessage = mag("RandomMessage",{
  controller: function() {
    return { message: 'Hello, Universe' };
  },
  clickHandler: function() {
    var messages = ['Hello, World', 'Hello, Planet', 'Hello, Universe'];
    var randomMessage = messages[Math.floor((Math.random() * 3))];

    this.state.message=randomMessage;
  },
  view: function(state, props) {
    state.MessageView =MessageView({message: state.message })
    state.input = {_onClick: this.clickHandler }  
  }
});
```

Our component RandomMessage maintains a message property in its state.
Every MagJS component has a `controller` function which sets the initial state of the component.
In our case we initialize the message property to the value Hello, Universe.

Next, we need to display a button which, when clicked, updates the message property with a new value.
The following is the markup returned by our component:

```js
state.MessageView = MessageView ({message: state.message})
state.input = { _onClick: this.clickHandler }  
```

As you can see, this component renders a second component, MessageView, and an input button.
Do note that message property of the component’s state is passed to the child component as an prop.
Our component also handles the button’s click event by attaching an event listener, this.clickHandler. 
Pay attention to camel casing here. In HTML the event names are written in lowercase i.e. onclick. 
But, in MagJS you can use any case, it doesn't matter.

Our click event handler chooses a random message and updates the component’s state by calling:

```js
this.state.message = randomMessage;
```

The state object is a way to inform MagJS about a data change.
This method updates the current state of the component and re-renders it.
As a result the passed props are also recomputed and the child components which depend on these props also re-render themselves.


### MessageView

```js
var MessageView = mag("MessageViewComp", (props) => {
    return {p: props.message }
});
```

This component just outputs the passed message property to the UI. 
You should note that this is a stateless component and is rendered by the stateful component RandomMessage.

Now that we have created the required components, it’s time to render the top level component RandomMessage. 
This is done as follows:

```js
mag(
 RandomMessage(),
 document.body
)
```

That’s it! Each time you click on the button you will see a different message (in so far as a new number is selected).
[Try it on JSBin](http://jsbin.com/sanocosigo/edit?html,output)

[Further Reading](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/README.md)

<hr>

[Inspired by React Article](https://www.sitepoint.com/getting-started-react-jsx/)
