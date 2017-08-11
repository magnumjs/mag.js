# Tutorial: State

So far, we've used MagJS as a static rendering engine. Now, we're going to add state to make MagJS components more dynamic.

The key difference between `props` and `state` is that state is internal and controlled by the component itself while props are external and controlled by whatever renders the component.
Let's see it in practice.

## Cow Clicker

```js
var CowClickerCtrl = {
  controller: function() {
    this.clicks= 0;
    this.img = {
      _onClick: CowClickerCtrl.onCowClick.bind(this)
    }        
  },
  onCowClick: function(evt) {
    this.clicks++
  }
};

var CowClicker = mag("CowClicker", CowClickerCtrl);

mag(
  document.getElementById('container'),
  CowClicker
)();
```
[Try it on JSBin](http://jsbin.com/lumapofufo/edit?js,output)


## API
**GETINITIALSTATE**

Implement the function controller, which returns... the initial state of the component. This is an object map of keys to values.

```js
controller: function() {
  return {
    clicks: 0
  };
}
```

Or you can use the `this` keyword:

```js
controller: function() {
  this.clicks = 0
}
```

**THIS.STATE**
To access a component's `state`, use `this` in the `controller` and `state` in the `view`, just like how we use `props`.

**THIS.SETSTATE**
To update a component's state, call `state` with an object map of keys to updated values. Keys that are not provided are not affected.

```js
state.clicks = state.clicks + 1
```

When a component's state changes, `view` is called with the new state and the UI is updated to the new output. This is the heart of magJS. We'll take a closer look in the next article.


