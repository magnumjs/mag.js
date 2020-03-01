# MagJS ~ Modular Application Glue

`npm i mag.js`

### *Super fast* & Simple Intuitive JS2HTML Templating Component Library

```js
import Mag from "mag.js"

//Component:
var Counter = Mag(`
  <div class="counter">
    <p>
     You clicked <count /> times
    </p>
    <button>
      Click me
    </button>
  </div>`,
  function({count=0}) {

  //JavaScript stuff:

  return {
    count,
    button: {
      onClick: e =>
        Counter({count: count + 1})
    }
  }
})

//Render:
Mag(
  Counter(),
  document.getElementById("root")
)
```

**[Try the demo on CodePen &rarr;](https://codepen.io/magnumjs/pen/QWwVNoa?editors=0010)**


[CodePen Examples](https://codepen.io/magnumjs)

[Codesandbox template](https://codesandbox.io/s/magjs-template-q4114)

[Video examples](https://www.youtube.com/playlist?list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)
--
[Old readme](README-old.md)

### Browser install

*Default includes **ONLY** Stateless Components **WITH** Hooks (useState, useEffect, useContext)*

`<script src="//unpkg.com/mag.js"></script>` 

### Alternate browser options

*State and Stateless Components **WITHOUT** Hooks*

`<script src="//unpkg.com/mag.js/dist/mag.min.js"></script>`

*State and Stateless Components **WITH** Hooks*

`<script src="//unpkg.com/mag.js/dist/mag.hooks.min.js"></script>`

*Only stateless Components **WITHOUT** useState, useEffect, useContext Hooks*

`<script src="//unpkg.com/mag.js/dist/mag-stateless.min.js"></script>`

