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
[Try it on JSBin](http://jsbin.com/lumapofufo/edit?js,output) - [without bind] (http://jsbin.com/juwozogufu/edit?js,output)


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

```js
var Board = mag("BoardComp", (props) => {
  var className = "board";
  if (props.selected) {
    className += " selected";
  }
  return {
    div: {
      _class: className,
      _text: props.index + 1
    }
  }
});

var BoardSwitcher = mag("BoardSwitcher", {
  view: function(state, props) {

    var boards = []

    for (var i = 0; i < props.numBoards; i++) {
      var isSelected = i === 0;
      boards.push(Board({
        index: i,
        selected: isSelected,
        key: i
      }));
    }

    state.boards = boards;
  }
}, {
  numBoards: 3 // default props
});

mag(
  document.querySelector("#container5"),
  BoardSwitcher
)();
```
[Try it on JSBin](http://jsbin.com/voyokacife/edit?js,output) - [View Solution](http://jsbin.com/tavelonuje/edit?js,output)

Components, props, and state form the core of MagJS. You're ready to build with MagJS!
<hr>

**NEXT ARTICLE**

**Under the hood**

To finish the core lessons, we'll take a look under the hood to understand how React works.

[Continue]()
