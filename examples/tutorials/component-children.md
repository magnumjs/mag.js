# Component Children

There is one prop that gets special treatment unlike all the others. That, my friend, is `props.children`.

Children allow you to pass components as data to other components, just like any other prop you use. 
The special thing about children is that Mag provides support through its `state`.
XML children translate perfectly to Mag children!

```js
var MyDiv = mag('MyDiv', {
  view: function(state, props) {
    state.div = props.children;
  }
})


mag.module("app", {
  controller: function(props) {
    this.MyDivInstance = MyDiv();
  }
});
```

[Try it on JSBin](http://jsbin.com/doroqiquqo/edit?js,output)

##props.children

If you look at the transform, you'll find that XML children are appended as arguments to the component. 
These extra arguments are passed to the component via `props.children`.

Most often, your component will render content and include the children in the render output. 
This is a great way to create UI components, like cards, headers, and buttons.

Occasionally, you may want to interact with the children, maybe mutating or separating them. 
Be careful here and remember to treat `props.children` as an opaque data structure. 
Instead of working with `props.children` directly, use Plain JS Node utilities to work with children. 
In this example, we create a component that takes its children and renders a list, wrapping each child in an `<li>`.

```js

```

[Try it on JSBin]()
