

#Mag.JS: A Tutorial Introductions (Part 1)

This is part 1 of a tutorial series. You can view part 2 [here](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/intro-part2.md).

Mag.js is a small (5kb) and fast, and I mean really fast, classical MVC JavaScript framework. It encourages an architecture similar to Angular.js controllers, and uses composable components like React.js, all while avoiding the need for libraries like jQuery. MagJS's small size and API makes it ideal for embedded JavaScript widgets and user interfaces that have high performance requirements.

My personal favorite part about MagJS is that it's just JavaScript. In other words, if you know how JavaScript-the-language works, you can fully apply that knowledge when using MagJS. Oh, and that also includes JavaScript's functional programming features and techniques :)

##Tutorial Overview

In this tutorial we are going to walk through building a real-world case study, slightly modified to focus on building the core pieces of a MagJS component. Afterwards we will study the small amount of glue code needed to get MagJS running on page load, and briefly talk about how MagJS keeps the DOM in sync.

##Here's the demo!

> Anxious? You can view the [code here](http://embed.plnkr.co/c59H2wmSu2LPfcXoViGe/).

This tutorial only covers the front-end; there will be no server-side code snippets.

##Project User Stories

As a user, I want to sign up for an event.
As a user, I want to sign up multiple people at once.
As an organizer, I need at least one attendee email address to send event details to.
As an organizer, I want to charge $10 per attendee.
As an organizer, I want to provide coupons to offer a percent discount on total price.
Getting Started

We're going to use this rudimentary starting point.

Keep in mind that the purpose of this project is to teach MagJS concepts, so it uses some non-best practices. In a real project you would minimize the use of DOM ids, concatenate and minify your JavaScript files, wrap your code in anonymous function scopes, and so on.

##MagJS Components

MagJS makes it easy to write modular code. In this project we will be writing three seperate components:

A contacts component, which will keep track of all the attendees' information entered,
A total component, which will calculate the final price, and
A coupon component, which will handle checking the validity of an entered coupon via AJAX.
A MagJS component is comprised of a Controller and a View:

The controller holds up to two main responsibilies: providing controller actions for the view, and managing component state. In MagJS, the controller is a constructor function.
The view is what the user sees; it renders based on the view state, and it binds user events to controller actions. In MagJS, the view is a function that returns a virtual DOM element.
In this project, each component will live in its own folder under src/components/. If you cloned the GitHub repo, you'll see skeleton files in each one.

##Strategy

In part 1 of this series we will first build the Contacts component. To incrementally introduce concepts, we're going to take the following approach:

Build the Model
Start the Controller
Build a part of the View
Complete the Controller
Complete the View

##1. The Contacts Model

Let's begin with the model. You may have noticed that we haven't mentioned the model at all up to this point. That's because MagJS imposes nothing special on your model; you can use whatever design pattern you like.

In this project we will use a simple constructor function:
```javascript
// contacts.js
Contacts.model = function () {  
  this.name  = mag.prop('[Your name]');
  this.email = mag.prop('[Your email]');
}
```

Here our model uses m.prop, a function that returns a getter-setter function. It's a small and elegant pattern that will later help us write short, succinct views.

In the above example we initialized the model with default values. This is just for demonstration; in practice you might use a blank string instead.

##2. The Contacts Controller

Now let's look at the controller. In software design, there is a pattern called the view-model. The view-model is the current state of the user interface. It contains transient data such as the text the user has typed in (but not saved), the index of the active tab, the array of models the user is viewing, and so on. In MagJS (and classical MVC), the view-model is often part of the controller.

According to our use case, we need to keep track of all entered attendees. We can do this with an array:

```javascript
// contacts.js
Contacts.controller = function () {  
  var ctrl = this
  ctrl.contacts = mag.prop([new Contacts.model()])
}
```

In this code we initialize with an empty model so the user will see one empty fieldset on page load (once we implement the view, which is coming up next).

We also use mag.prop here to follow the Uniform Access Principle. Not only do we gain consistency by making all view-model data accessible via parethesis (i.e. calling the getter), but we also retain the flexibility to later turn this into a computed property — if needed — such as using MagJS's clever m.request to load data from a server.

##3. The Contacts View

Now that we have our controller set up, we can set up a view to present it. In MagJS, a view is a plain function that returns a virtual DOM element. Here is everything at once:

```javascript
// contacts.js
Contacts.view = function (state, props) {  

  state.contacts = {
   'h3' : 'Please enter your contact information:'
  }
    
  state.fieldset = state.contacts().map(function(contact, idx) {

    return {
      'legend': "Attendee #" + (idx + 1),

      name: {
        _value: contact.name(),
        _onchange: mag.withProp('value', contact.name)
      },
      email: {
        _value: contact.email(),
        _onchange: mag.withProp('value', contact.email)
      }
    }
  })
  
}
```

MagJS injects the controller into the view (more on that later), so we have access to state as a parameter.


The array passed to state.contacts', [...]) represents the children of the .contacts div, inside which we generate an h3 tag, as well as another array of virtual DOM elements (the attendee fieldsets).
The object in state.contact.name, {...}) reperesents the html tag attributes of the input element for the name field.

The parts value: contact.name() and value: contact.email() are how we bind the value of the model to the view (we will see how to do the other side of two-way data binding in a later step).
Note how we're using plain old JavaScript features. This is a big benefit of using MagJS — no preprocessors or build step needed. We can also refactor this code later (if necessary) using standard JavaScript and software design techniques.

Here is the resulting HTML:
```html
<div class="contacts">  
  <fieldset>
    <legend>Attendee #1</legend>
    <label>Name:</label>
    <input type="text">
    <br>
    <label>Email:</label>
    <input type="text">
  </fieldset>
</div>
```

After completing the controller in the next step, if you open index.html in your browser, you will see the inputs pre-filled with the values we initialized in the model.

##4. Completing The Contacts Controller

Now it's time to add some user interaction. According to our user stories, the user needs to be able to add additional attendees in the same form. Since this logic is decoupled from the view, it is quite straightforward:

```javascript
Contacts.controller = function (props) {  

// this = "state" in view
// use props to pass data that is not an elementMatcher
  
  props.contacts = mag.prop( [new Contacts.model()] )

  props.add = function () {
    var newModel = new Contacts.model()
    props.contacts().push(newModel)
  }
  props.remove = function (idx) {
    props.contacts().splice(idx, 1)
  }
}
```

The add and remove functions are called controller actions. We can now bind these actions to the view.

##5. Completing the Contacts View

We have two controller actions to bind. Let's start with add, since it's easy — we just need an anchor tag:

```javascript
state.$a = { _onclick: props.add, _href:'#', _text : 'Add another attendee' }
```

The onclick: ctrl.add is the part where we bind the add action to the anchor link. Now, when the user clicks this anchor, that controller action will run.

Insert this into the view like so:

```javascript
Contacts.view = function (state, props) {  
  state.contacts = {
    h3: 'Please enter your contact information:',
    
    li : props.contacts().map(function (contact, idx) {
      // [clipped]
    }),
    
    //$ = greedy selection - default is to the first
   state.$a = { _onclick: props.add, _href:'#', _text: 'Add another attendee' }
  
}
```

And that's it! If you're coding along, refresh the page and try clicking the new anchor in your browser.

##Removing Attendees

The requirements for remove are trickier. We want users to be able to remove extraneous attendees, but not remove all of them. In other words, the page needs to have at least one fieldset at all times.

To solve this, we will only show a link to remove an attendee if more than one exist. Fortunately our views are Just JavaScript™, so this shouldn't be a problem :)

To keep our view code clean, let's create a helper method. Add this code after your Contacts.view function:

```javascript
function removeAnchor (state, idx) {  
  if (ctrl.contacts().length >= 2) {
   return {
      _text: 'remove',
      _onclick: ctrl.remove.bind({}, idx),
      _href: '#'
    }
  }
}
```

Never seen bind before? Don't worry; I explain it later this tutorial.

This helper will only return a "remove" anchor link if there are two or more attendees.

Now we can [quite elegantly] add this new link to our view:

```javascript
Contacts.view = function (state, props) {  

  state.fieldset = state.contacts().map(function(contact, idx) {

    return {
      'legend': "Attendee #" + (idx + 1),

      name: {
        _value: contact.name(),
        _onchange: mag.withProp('value', contact.name)
      },
      email: {
        _value: contact.email(),
        _onchange: mag.withProp('value', contact.email)
      },
      a: removeAnchor(ctrl, idx)
    }
  })

  state.a = {
    _onclick: ctrl.add,
    _href: '#',
    _text: 'Add another attendee'
  }
}
```

And that'll do it!

##Two-Way Data Binding

...well, almost.

Try this: add two attendee contacts, fill in their names, and then add another. Oh no, our data got lost! This happens because we only implemented one-way data binding — from model to view. We still need to implement the other direction — from view to model.

To do so, we need to respond to the onchange event. If we wanted to, we could use a function, updating the model like so:

```javascript
state.input = {  
  _value: contact.name(),
  _onchange: function (e) {
    contact.name(e.currentTarget.value)
  }
}
```
But we can do better! Because contact.name is a function (remember mag.prop?), we can compose it with mag.withProp to accomplish the same thing:

```javascript
state.input = {  
  _value: contact.name(),
  _onchange: mag.withProp('value', contact.name)
}
```
Apply that to the other input, and we're done!

##Tying Loose Ends

There's one part I haven't mentioned yet — the code that mounts the MagJS component to the DOM on page load. You'll find the this code in index.html:

mag.module('app', Contacts)  
The mag.module function binds a component to a DOM element. As a reminder, a component is a JavaScript object with two properties: controller and view (and as we'll see in part 2, controller is optional!)

When we give Contacts to mag.module, MagJS initializes the controller with the keyword new, and then proceeds to call the view function with the that initialized controller.



###Conclusion

MagJS is a wonderful, lightweight framework that doesn't try to abstract over JavaScript-the-language. Because it uses functional JavaScript constructs, we can refactor our views and controllers in ways that are framework-agnostic, allowing us to construct the right architecture for our application.

In part 2, we will implement both the Total and Coupon components. Until next time!

Further Reading

[Getting Started with Mag.js](https://github.com/magnumjs/mag.js/blob/master/examples/README.md)

Differences from other MVC frameworks
