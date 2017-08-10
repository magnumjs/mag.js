# Tutorial: Selectors

Let's address the elephant in the room first. You will be writing selectors with your MagJS code.

Selectors are simply your description of what should be interpolated in a plain JavaScript Object. 

- In the `controller` it is the `this` Object or the Object returned `{}`
- In the `view` it is the `state` Object, the first argument.
- In stateless components it is the returned Object `{}`

There are 5 element Matchers for selectors and they can be nested.

- ID
- class
- tagName
- name attribute
- data-bind attribute

Selectors work in their own Isolate, the current Element scope.

Selectors can also be greedy `$` selected: `state.$input={_value: "Name?"}`

Selectors can also have attributes denoted by the  leading underscore `_`: `state.input = {_disabled: true}`

Selector events are just attributes that start with and `_on` such as `_onClick`: `state.h1 = {_onClick()=>alert('Hi')}`

Special selectors `_html` and `_text` allows you to use one selecotr for multiples values such as `state.h1 = {_text:"", _class:""}`

Selectors can also be customized via hookins for example `_className` comes in Addons.

*Now with the facts out of the way:*

<hr>
## Selector Examples

```js
{div: {_class: "red", _text: "Children Text" };
MyCounter({count: 3 + 5});

// Here, we set the "scores" attribute below to a JavaScript object.
var gameScores = {
  player1: 2,
  player2: 5
};

state.DashboardUnit = Scoreboard({className:"results, scores=gameScores});
```

The above gets interpolated to the following HTML.

```html
<div class="red">Children Text</div>

<MyCounter><count>8</count></MyCounter>

<DashboardUnit>
  <h1>Scores</h1>
  <Scoreboard>
    <ul class="score results">
      <li data-bind="player1>2<li>
      <li data-bind="player2>5<li>
    </ul>
  </ScoreBoard>
</DashboardUnit>
```

<hr>
## Exercise: Selectors

Try to match the markup of the box contents. I recommend referring to the HTML tab and/or inspecting the DOM.

```html
<h1>Match This</h1>
<div class="box">
  <div>
    <a href="#" class="button">Button</a>
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</div>
  </div>
</div>

<h1>Your Implementation</h1>
<div id="impl" class="box" />
```
[Try it on JSBin]()

<hr>
**NEXT ARTICLE**

**Components**

Components are the building blocks of React. Master them and see a new side of web development.

[Continue]()
