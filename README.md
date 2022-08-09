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
**[Updated demo on CodePen &rarr;](https://codepen.io/magnumjs/pen/ExEpWVp?editors=0010)**


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

### API

```js
Mag ( Node | HtmlString, Function | Node | HtmlString, [DefaultProps])

returns [Function]
```

## Examples

Render to Live Node no return Function:

```js
Mag(
  "<h1>Hello!</h1>",
  document.getElementById("root")
)
```

Attaches to Live Node with return Function to render:
```js
const App = Mag(
    document.body,
    (props) =>
      `<h1>${props.name}!</h1>`
)
//Renders:
App({name: "Mike"})
```

Attaches to HtmlString
```js
const Welcome = Mag(
  "<h1>",
  ({name}) => {
    return `Hello, ${name}!`
  }
)
//Renders Node:
Welcome({name: "Michael"})
```

Attach Component to live Node
```js
Mag(
  Welcome({name: "Michael"}),
  document.getElementById("root")
)
```


Attach Component to another Component

```js
//Container: 
const Container = Mag(
  "<div>", 
  (props) => {
    return {
      _class: "container " + props.classNames + props.count
    }
})

//Component:
var Counter = Mag(
  Container({ classNames: "extra" }),
  ({ count }) => {
  const handler = () => {
    Counter({ count: count + 1 })
    Container({ count: count + 1 })
  };

  return Mag`
   <p>
      You clicked 
      ${count} times
    </p>
    <button onClick=${handler}>Click me</button>`
})

//Render:
Mag(
  Counter({ count: 0 }),
  document.getElementById("root")
)
```