##Simple component count example

###Using dynamic container node & independent component

[Example JSBin](http://jsbin.com/minaqineki/edit?html,output)

First the html
```html
<div id="demo">
  <h2>Boilerplate <span></span></h2>
  <button>COUNTER
    <count/>
  </button>
  <div id="counter">
    <b>HOWDY!</b>
    <h1></h1>
  </div>
</div>
```

Then the Parent container module:

```javascript
//defaultProps                     
var props = {
  name: 'Mike!'
};

// parent module
mag.module(document.body, {
  view: function(state, props) {
    counter({
      hey: props.name + state.count
    });
    state.button = {
      count: state.count,
      _onClick: function() {
        state.count++;
      }
    };
  }
}, props);
```

Lastly the component

```javascript
// independent component
var counter = mag.create('counter', {
    view: function(state, props) {
      state.b = {
        _style: {
          fontSize: props.size
        }
      };
      state.h1 = 'Hello ' + props.hey;
    }
  }, {
    size: 20
  } //DefaultProps
);
```
Html that is produced after several clicks

```html
<div id="demo">
  <h2>Boilerplate <span></span></h2>
  <button>COUNTER
    <count>6</count></button>
  <div id="counter">
    <b style="font-size:20px;">HOWDY!</b>
    <h1>Hello Mike!6</h1>
  </div>
</div>
```

