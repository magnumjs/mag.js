# MagJS ~ Modular Application Glue

`npm i mag.js`

### *Super FAST* Simple Intuitive Js2Html Templating Component Library

```js
import Mag from "mag.js"

// 1. Define Component:
const Counter = Mag(
  function (props) {

  const handler = () => 
    // Render Component Event:
    Counter({ count: props.count + 1 });
  
  // MagJS Tag Template:
  return Mag`
   <p>
      You clicked 
      ${props.count} times
    </p>
    <button onClick=${handler}>
      Click me
    </button>`
})

// 2. Render Component:
Mag(
  Counter({ count: 0 }),
  document.getElementById("root")
)
```
**[Try the demo on CodePen &rarr;](https://codepen.io/magnumjs/pen/RwMYdax?editors=0010)**
**[With useState &rarr;](https://codepen.io/magnumjs/pen/ExEGmXR?editors=0010)**
**[With Component Template &rarr;](https://codepen.io/magnumjs/pen/QWwVNoa?editors=0010)**
**[With Component Container &rarr;](https://codepen.io/magnumjs/pen/ExEpWVp?editors=0010)**


[CodePen Examples](https://codepen.io/magnumjs) - 
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

# API

## Render

```js
//Renders, returns nothing
Mag (
  Node | HtmlString,
  Node | querySelector
)
```

## Component

```js
//Define, returns Render Function:
const Function = Mag (
  // Optional
  [Node | HtmlString | querySelector], 
  Function = [props =>
      ObjectElementMap | 
      HtmlString | 
      Null
     ]
)

//Call with optional Props and Render:
const Node = Function (props)
```

```js
const HelloMessage = Mag(props => {
  return `
    <div>
      Hello ${props.name}
    </div>
    `
})

Mag(
 HelloMessage({name: "Taylor"}),
 document.getElementById('root')
)
```

## Tag

```js
const Node = Mag`<HTMLString>`
```
<hr/>

```js
const Node = Mag`
  <button 
    onClick="${e=>console.log(e)}">
    Clicker!
  </button>`

Mag(Node, document.body)
```

*Tag Component*
```js
var Button = Mag(
  '<button>',
  props => {
    onClick: props.handler
  }
)

Mag(
  Mag`<Button 
    handler=${e=>console.log(e)}>`,
  "root"
)
```

## Hooks

```js
//Per component
const [state, setState] = 
  Mag.useState(
    initialState
)

Mag.useEffect(() => {
  // on didUpdate
  return () => {
    // onUnload
  }
}, [] //optional depedencies
)

//Across Components
const [context, setContext] = 
  Mag.useContext(
    StringName,
    initialContext // Optional
)
```

### Rendering Examples

*Render to Live Node no return Function:*

```js
Mag(
  "<h1>Hello!</h1>",
  document.getElementById("root")
   // or just: "root"
)
```

*Attach to Live Node with return Function to render:*
```js
const App = Mag(
    document.body,
    (props) =>
      `<h1>${props.name}!</h1>`
)
//Renders:
App({name: "Mike"})
```

*Attach to HtmlString*
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

*Attach Component to live Node*
```js
Mag(
  Welcome({name: "Michael"}),
  document.getElementById("root")
)
```


*Attach Component to another Component*

```js
//Container: 
const Container = Mag(
  "<div>", 
  (props) => {
    return {
      _class: "container " + 
        props.classNames + 
        props.count
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
    <button 
      onClick=${handler}>
      Click me
    </button>`
})

//Render:
Mag(
  Counter({ count: 0 }),
  document.getElementById("root")
)
```

*Dynamic Tag Component*

```js
var HelloMessage = props => {
  return `
    <div>
      Hello ${props.name}
    </div>
    `
}

Mag(
 mag`<${HelloMessage} name=Taylor>`,
 document.getElementById('root')
)
```

*With Children*

```js
  const Message = props => {
    return props.children;
  };

  const HelloMessage = props => {
    return mag`
      <${props.Message}>
        Hello ${props.name}
      <//>
      `;
  };

  Mag(
    mag`<${HelloMessage} 
      name="Taylor" 
      Message=${Message}
      >`,
    document.getElementById('root')
  )
  ```

### Hooks Examples

```js
const App = Mag(
  "root",
  (props) => {
    const [count, setCount] = 
      Mag.useState(props.count)

    return {
      _html: `<button>
        Counter!</button>
        <h1>Current Count:
        <count/>`,
      count,
      button: {
        onClick: () 
        => setCount(count + 1)
      }
    }
})

App({ count: 0 })
```
