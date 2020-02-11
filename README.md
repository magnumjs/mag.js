# MagJS ~ Modular Application Glue

`npm i mag.js`

`npm test`
`npm start`
`npm run build`

### *Super fast* & Simple Intuitive JS2HTML Templating Component Library

```js
import Mag from "mag.js"

//Component:
var Counter = Mag(`
  <div class="counter">
    <p>
     You clicked <count></count> times
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

**[Try the demo on CodePen &rarr;](https://codepen.io/magnumjs/pen/MWYMErB?editors=0010)**


[CodePen Examples](https://codepen.io/magnumjs)

[Codesandbox template](https://codesandbox.io/s/883vqwy840)

[Video examples](https://www.youtube.com/playlist?list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)
--
[Old readme](README-old.md)

### Browser install

*Both state and stateless Components with or without Hooks (useState and useEffect)*

`<script src="//unpkg.com/mag.js"></script>` 

`<script src="//unpkg.com/mag.js/dist/mag.hooks.min.js"></script>`

*Only stateless Components with or without useState and useEffect Hooks*

`<script src="//unpkg.com/mag.js/dist/mag-stateless.min.js"></script>`

`<script src="//unpkg.com/mag.js/dist/mag-stateless.hooks.min.js"></script>`