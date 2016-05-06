## HoC (Higher Order Components)

These are simply components that wrap other components.

Since v0.22.11 we can now wrap dynamic nodes (unattached DOM element) as the first argument instead of a string elementID.

```javascript
var node = document.createElement('div')
mag.module(node, component)
```

Not having them exist already in the DOM allow for greater flexibility
but generally only used when nexessary since will delay render vs already attached nodes will always be faster.

##Example HoC with Dynamic unattached Node

Pseudo code, full example follows below

```javascript
//Reusable Dummy component
var ClockComponent = {
  view: function (state, props){
    state.time = props.timestamp ? Date.now(): Date()
  }
}

//Compose our component with a dynamic node
var props = {
  clock: mag.composer(mag.affix('div time'), ClockComponent)
}

//Container
mag.module('demo', {
  view: function(state, props){
    state.clockTime = props.clock({timestamp: true});
    state.clockDate = props.clock();
  }
}, props);

```

*Notes*

I am using `mag.affix` as quick way to generate dynamic DOM elements with CSS selectors

[Simple reusable component with HoC](http://jsbin.com/fidenayali/edit?html,output) - 
[Complete Example](http://jsbin.com/gawakuloko/edit?html,output)
