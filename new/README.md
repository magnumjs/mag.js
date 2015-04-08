#MagNumJS (Mag.JS) v2

##Complete rewrite

###leveraging fill.js,watch.js and mithril.js module architecture

* Goal is to use HTML as template and a related module as instructions for transpiling/interpolations.

* Module has a constructor, called once and a viewer called on every change to the state of that module.

```javascript
Input:
<div id="hello">
  <h1></h1>
</div>

Module:
mag.module('hello', {
  view: function(element, props, state) {
    state.h1 = 'Hello Mag.JS!'
  }
})

Output:
<div id="hello">
  <h1>Hello Mag.JS!</h1>
</div>
```
Hello world Example:
http://jsbin.com/gotuziboho/edit?js,output

Hello world example with passFail reusable component:
http://jsbin.com/jivicehuwe/edit?js,output

List example: 
http://jsbin.com/gegawunifu/edit?js,output

More lists: 
http://jsbin.com/bilugakexe/edit?js,output

Tab component example:
http://jsbin.com/hoqojuqora/edit?js,output

Todos Example: 
http://jsbin.com/rimawetuso/edit?js,output


Contacts Example:
http://jsbin.com/yupitowomu/edit?js,output
