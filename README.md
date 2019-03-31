# Mag.JS

## Modular Application Glue

`npm install mag.js`

### browser install

`<script src="https://unpkg.com/mag.js"></script>`

### Intuitive JS 2 HTML Templating Component Library

```html
<div class="counter">
  <p>You clicked <count></count> times</p>
  <button>
    Click me
  </button>
</div>
```


```js
const Counter = mag("counter", props => {
  const [count, setCount] = mag.useState(0)
  return {
    count,
    button: {
      onClick: () => setCount(count + 1)
    }
  }
})
```

```html
<app>
    <counters></counters>
</app>
```

```js
const App = mag("app", props => ({
  counters: props.counters.map((name, key) => Counter({name, key}))
}))
```

```js
const counters = ['first', 'second']
App({counters})
```

[Try it out](https://codepen.io/anon/pen/vMBKvv?editors=1010)

[Without useState](https://jsbin.com/nojuxihucu/edit?html,output)

[Old readme](README-old.md)