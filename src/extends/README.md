###Extends

Extends mag core functionality such as

`mag()`

`mag.module`


##Example

###mag.template

Enables core functions to include a template url in either the first argument or the Object component itself

```javascript
mag.module('template-app', {
  controller: function() {
    this.counter = 0;
    this['my-template'] = 'Loading..';
    this.button = {
        _onclick: () => {
          this.counter++;
        }
      }
      // this.file = mag('template.html', {
    this.file = mag({
      templateUrl: 'template.html',
      view: function(state, props) {
        state.namer = props.name;
      }
    });
  },
  view: function(state) {
    if (!state.file.then) {
      state['my-template'] = state.file({
        name: 'LOVER!' + state.counter
      });
    }
  }
});
```

[Example](http://embed.plnkr.co/Gw9EbeKizZTBKeytWtWt/)
