# Mag.JS

## Modular Application Glue

`npm i mag.js`

`npm test`
`npm start`
`npm run build`

### browser install

`<script src="//unpkg.com/mag.js"></script>`

`<script src="//unpkg.com/mag.js/dist/mag.use-state.min.js"></script>`

`<script src="//unpkg.com/mag.js/dist/mag.use-state-use-effect.min.js"></script>`

### Intuitive JS 2 HTML Templating Component Library

```html
const CounterHTML = `
<div class="counter">
  <p>You clicked <count></count> times</p>
  <button>
    Click me
  </button>
</div>
`
```


```js
const Counter = mag(CounterHTML, props => {
    
  const [count, setCount] = mag.useState(0);

  return {
    count,
    button: {
      onClick: e => setCount(count + 1)
    }
  }
})
```

```html
<div id="root"></div>
```

```js
const App = mag(
    'root',
    props =>
        props.counters.map((name, key) => Counter({name, key}))
)
```

```js
App({counters: ['first', 'second']})
```

[Try it out](https://codepen.io/magnumjs/pen/MWYMErB?editors=0010)

[Without useState](https://jsbin.com/hosuyezabi/edit?html,output)

[codesandbox template](https://codesandbox.io/s/883vqwy840)

[videos with latest examples](https://www.youtube.com/playlist?list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)

[Old readme](README-old.md)