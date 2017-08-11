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
