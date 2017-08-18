# Tutorial: Events

Let's dive right in. This example component renders a div that responds to click events.

## Syntax

```js
var BannerAd = mag.module('body',{
  onBannerClick: function(evt) {
    // codez to make the moneys
  },

  view: function(state) {
    // Render the div with an onClick prop (value is a function)
    state.div ={_onClick: this.onBannerClick, _text: "Click me!" };
  }
});
```

That's it. You add onXXX to the nodes you want. 
Notice how the value of the prop is a function.
The events are native not synthentic.

**BUT INLINE HANDLERS?**

First HTML selectors in my JavaScript and now inline handlers. 
I promise that MagJS doesn't hate the world. We know that inline onclicks are a bad practice in HTML, but not in MagJS. 
We'll see why soon in the deep dive section.

<hr>

## Exercise: Events

This one's a little trickier but you know everything you need. Remember that you can pass functions as props.

```js
var ParentComponent = mag("ParentComponent", {
  performMagic: function() {
    alert('TAADAH!');
  },

  view: function(state) {
    state.div = ChildComponent()
  }
})

var ChildComponent = mag("ChildComponent", {
  view: function(state, props) {

  }
})

mag(
  document.getElementById("container"),
  ParentComponent
)()
```

[Try it on JSBin](http://jsbin.com/godehupamo/edit) - [View Solution](http://jsbin.com/mizesenopa/edit?js,output)

<hr>

**NEXT ARTICLE**

**State**

We'll learn about the other half of what makes MagJS components special.

[Continue](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/build-with-magjs-tutorial-state.md)
