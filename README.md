<a href="//github.com/magnumjs/mag.js">
<img alt="Mag.JS - Elegant DOM Bindings" src="https://cloud.githubusercontent.com/assets/5196767/7222868/53794478-e6e5-11e4-886c-40c2a3512654.png"/>
</a>

### Intuitive, tiny, fast, JavaScript 2 HTML component templating library.
<hr>

## Features
 
* Changes to state are immediately reflected in the dom by their element matchers. <a href="#performance">Super crazy fast</a> & 8KB Gzip!
* Valid HTML templates - No virtual/shadow dom or new templating language!
* Semantic data binding - Use normal HTML as a template and a related module (plain JS object) as instructions for transpiling/interpolations.
* Module has a constructor, called once and a viewer called on every change to the state of that module.
* Collection rendering - No need for hand-written loops. Write templates as a part of the HTML, in plain HTML
* View logic in JavaScript - No crippled micro-template language, just plain JavaScript functions
* Native events & attributes, full life cycle events control, Hookin to modify and create custom attributes
* Built-in observables on existing data structures like objects, arrays for state and props reactivity

## [Introduction](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/introduction.md) - [Getting started](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/getting-started.md) ::: <a href="#examples">Examples</a> - <a href="#tutorials">Tutorials</a> - <a href="#simple-api">Api</a> - <a href="#jasmine-specs">Tests</a> - <a href="#performance">Performance</a>

<a href="http://www.youtube.com/watch?feature=player_embedded&v=xdjPez4oOTA
" target="_blank"><img src="http://img.youtube.com/vi/xdjPez4oOTA/0.jpg" 
alt="Mag.JS - Elegant DOM Bindings" width="774" height="480" border="10" /></a>


> *"There is no JavaScript code in the HTML and there is no HTML code in the JavaScript!"*

### Hello MagJS!

```javascript
Initial dom:
<div id="hello">
  <h1></h1>
</div>

Module:
mag.module('hello', {
  view: function(state) {
    state.h1 = 'Hello Mag.JS!'
  }
})

Mag.JS dom!:
<div id="hello">
  <h1>Hello Mag.JS!</h1>
</div>
```

*View receives 2 arguments, "state" & "props"* 

1. <code>state</code> is the DOM element(s) we want to set/get - the element Matchers and their controls
  1. Any change to the <code>state</code> object will trigger a redraw of the view - it is observed.
2. <code>props</code> is what we want the DOM element(s) to be set to - the data
 2. If the <code>props</code> have changed a new view redraw will run if triggered.
 2. <code>props</code> are passed from the parent and is set by <code>mag.module()</code> or an instance `instance (props)`
 2. Components can reference others Components in props to pass children elements directly into their output: `props.children = mag()`
 
 
### Dynamic node example with controller

```javascript
mag.module(document.body, {
  controller: function() {
    this.h2 = 'Hello MagJS World!';
  }
});
```
Controllers are only called once vs views which are re-run on every change to the state.
[Example](http://jsbin.com/foduyagimi/edit?js,output) - [Prevent initial placeholder flicker](http://jsbin.com/xezuwiyuke/edit?js,output) 

### Two way binding

```javascript
var Component = {
  controller: function() {
    this.yourName = '';
  }
}
```
Just define the default value of the selector to bind.
- [Input](http://jsbin.com/dekekaneri/edit?js,output) - [Checkbox](http://jsbin.com/mabawamuge/edit?js,output) - [Radio](http://jsbin.com/jikopenoho/edit?js,output) - [Select](http://jsbin.com/mepadanuso/edit?js,output) - [Multiple](http://jsbin.com/fisutemane/edit?js,output)
- [Greedy selector](http://jsbin.com/tatanedose/edit?js,output) 
- [Multiple fields](http://jsbin.com/vixupukefo/edit?js,output) 
- [Hookin attribute](http://jsbin.com/gosusitara/edit?html,output)
- [Delete Element](http://jsbin.com/fikamayoki/edit?js,output) - [Remove & Reattach](http://jsbin.com/zorocitire/edit?js,output)

## Tutorials

* [Intro Guide](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/build-with-magjs-tutorial.md)
* [Guide quick example (1st component)](http://rawgit.com/magnumjs/mag.js/master/examples/tutorials/guide-quick-example.html)
* [Getting started with  MagJS and Selectors](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/getting-started-magjs-selectors.md)
* [Thinking in React in MagJS](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/thinking-in-react-in-magjs.md)
* [Comments Components from React](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/react-comments-component.md)
* [Stateless Components](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/stateless-components.md)
* [Video Instructions](https://www.youtube.com/watch?v=OIXfxZ3DSC8&list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)
* [More Tutorials..](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/README.md)


### Hello world!

[JSBin](http://jsbin.com/rasewupabu/edit?js,output) - [Ternary](http://jsbin.com/jekizosere/edit?js,output) - [Controller](http://jsbin.com/miseqojuqo/edit?js,output) - [Handler](
http://jsbin.com/helibowuda/edit?js,output) - [Merge props](http://jsbin.com/jiguwavote/edit?js,output) - [Subscribe](http://jsbin.com/xejupidoni/edit?js,output) - [Proxy](http://jsbin.com/sujuhogoje/edit?js,output) - [No view only controller](http://jsbin.com/sozupogucu/edit?js,output) - [Component prop](http://jsbin.com/feyihegoho/edit?js,output) - [Parent Child Controller Comps](http://jsbin.com/wacafirato/edit?js,output) - [Componentized](http://jsbin.com/deqoxequfu/edit?js,output) - [Dynamic templates](http://jsbin.com/mebasukisu/edit?output)

Initial html
```html
<div id="hello">
  <label>Name:</label>
  <input type="text" placeholder="Enter a name here" />
  <hr/>
  <h1>Hello <span class="name"></span>!</h1>
</div>
```
Module:

```javascript
mag.module("hello", {
  view: function(state) {
    state.input = {
      _oninput: function(e) {
        state.name = e.target.value
      }
    }
  }
})
```

## Boilerplates
[Blank JSBin](http://jsbin.com/lumayuvuxo/edit?html,output) - [Blank CodePen](https://codepen.io/anon/pen/oeEdEZ?editors=0010) - 
[Event Module](http://jsbin.com/hivesozebu/edit?js,output) - [JSbin Addons](http://jsbin.com/xawibowoxo/edit?html,output) - [CodePen Addons (Simple Modal)](https://codepen.io/anon/pen/ZJxNrW?editors=0010) - [Plunker](http://embed.plnkr.co/wr8iYxoyWKcBcA4IbIW9/) -  [Plunker Namespace](http://embed.plnkr.co/HlQyXMG9DqXDdngqKZtI/) - [Plunker Templating](https://embed.plnkr.co/aloqG4YKgyJXCtJyWS5C/) - [Stateless](http://jsbin.com/gotehejebi/edit?html,js,output)

## Examples

[Hello world](http://jsbin.com/gavijobuxu/edit?js,output) - 
[Hello world, take2](http://jsbin.com/juwijubima/edit?js,output) - [With dynamic Node](http://jsbin.com/gezewacibo/edit?js,output)

*Components*

[Simple Component Container](http://jsbin.com/cajepafuzo/edit?js,output) - [Reusable Clock component](http://jsbin.com/mubixecodi/edit?html,output) - [Master detail](http://jsbin.com/letakipozo/edit?js,output) - [Stateless components perf](http://jsbin.com/jozafowuyu/edit?html,output) - [Clocks](https://codepen.io/anon/pen/prpoWx?editors=0010)

[Component Composition containment](http://jsbin.com/hidixegetu/edit?js,output) - [Component composition specialization](http://jsbin.com/botihemitu/edit?js,output)

[props.children accessor](http://jsbin.com/gehiqogogo/edit?js,output) - [Access static children of placeholder from inner module](http://jsbin.com/hakikerusi/edit?js,output) - [Specialization with props.children](http://jsbin.com/sefugaroni/edit?js,output) - [Shared state](http://jsbin.com/jixinexohu/edit?js,output)

[Reusable Tooltip Component](http://jsbin.com/fewutudise/edit?js,output) - [Controller only](http://jsbin.com/gebezelehu/edit?js,output)

[Simple Wrapped component(HoC)](http://jsbin.com/puwivumele/edit?html,output) - [Reusable Container(HoC)](http://jsbin.com/meyoxupedo/edit?html,output) - [Switch and Remove Comps](http://jsbin.com/vohofamabu/edit?html,output)

[Simple tabbed content](http://jsbin.com/zewuvaraqe/edit?html,output) - [Initialization](http://jsbin.com/sevaqipavo/edit?js,output)

[Toggle Button](https://codepen.io/anon/pen/brLGEq?editors=0010) - [Custom Component](https://codepen.io/anon/pen/qPBBab?editors=0010) - [Counter Component](https://codepen.io/anon/pen/YrzzLx?editors=0010)

*Async*

[SetTimeout](https://codepen.io/anon/pen/oGLLgG?editors=0010)

[Native promise](https://codepen.io/anon/pen/QqEWry?editors=0010)

[Using fetch to render json data](https://codepen.io/anon/pen/yzebXL?editors=0010)

*Stateless*

[Timer](https://embed.plnkr.co/uM3oUrbP1KddLzuzkro0/) - [Counter](http://jsbin.com/gadidokare/edit?js,output) - [Interaction with state](http://jsbin.com/lukowekoye/edit?html,output)

[Simple Todos](http://jsbin.com/dizapinodo/edit?html,output) - [Stateless counter](http://jsbin.com/nitakoruve/edit?html,output)

[Icons as Components](https://codepen.io/anon/pen/OjoNdQ?editors=0010) - [Deep Nesting (keys, children, create)](https://codepen.io/anon/pen/GvXdLJ?editors=0010)

[Recursive Error](https://codepen.io/anon/pen/KvxoBK?editors=0011)

*App State*

[Shared across modules](http://jsbin.com/fagoxavixi/edit?js,output) - [Synchronous state](http://jsbin.com/kiyopowefe/edit?console,output)

*Forms*

[Select menu](http://jsbin.com/bepevufiju/edit?js,output) - [Linked menus](http://jsbin.com/diwutumexe/edit?js,output)

[Multiple Radio selection](http://jsbin.com/pegokexiya/edit?html,js,output) - [Multiple Select Menu](http://jsbin.com/yobilirozi/edit?js,output)

[Transform Input - Concatenate](http://jsbin.com/qezanufoje/edit?js,output) - [To Upper Case](http://jsbin.com/huruditosu/edit?js,output)

[Slider](http://jsbin.com/qejijurumu/edit?js,output) - [Textarea](http://jsbin.com/retojulani/edit?js,output) - [Remove elements temporarily](http://jsbin.com/gozunesuhi/edit?js,output)

[Dynamic Radio Group](http://jsbin.com/coqigipaco/edit) - [Pre-selected](http://jsbin.com/piyoruqido/edit?js,output) - [Static group](https://codepen.io/anon/pen/brygKV?editors=0010) - [MagJS Radio Button / Pads](https://codepen.io/anon/pen/LjojQP?editors=0010)

[Basic Math: addition](http://jsbin.com/hejujixumi/edit?html,js,output) - 
[Basic Math: addition (no auto binding)](http://jsbin.com/cenuvozofa/edit?html,js,output) -  [Take 3](http://jsbin.com/dajewaqule/edit?js,output) - [Take 4](http://jsbin.com/gabumocijo/edit?html,js,output) - [V0.12 auto wiring](http://jsbin.com/mosagojopa/edit?html,js,output) - [Video tutorial](http://youtu.be/OIXfxZ3DSC8) - [Nested data auto wiring](http://jsbin.com/nogupefuga/edit?js,output)

[Auto wiring - select menu](http://jsbin.com/roriyisilo/edit?js,output) - [Single form create/edit](https://embed.plnkr.co/h5g9QrRjRAuJdnIW8dkt/)

[Quiz](http://jsbin.com/wacoqufeho/edit?html,js,output) - [Instant validation](http://jsbin.com/budisilowu/edit?js,output) - [Field valid](http://jsbin.com/dilitagehi/edit?js,output) - [Simple](http://jsbin.com/tawoxufeye/edit?js,output)

[Forms - input handling](http://jsbin.com/yeburizuro/edit?js,output) - [AutoComplete w/spinner](http://jsbin.com/nukedikode/edit?html,output) - [Select menu](http://jsbin.com/goxejiqeso/edit?html,output) - [Select addon](http://jsbin.com/bamogobine/edit?html,output)

[Forms - passFail component](http://jsbin.com/sopitoneyu/edit?js,output) - [Search Highlight](http://jsbin.com/hitizumege/edit?html,output)

[Form & list - model - comps - boilerplate](http://embed.plnkr.co/w3BSEEp0w5iWzM7B7QIw/)

[Simple messaging component example](http://jsbin.com/biharowaba/edit?js,output) - [Video tutorial](https://www.youtube.com/watch?v=WLSNbSOk1CY) - [Take 2, w/Reusable child component](http://jsbin.com/vafovoguka/edit?html,js,output) - [Nested components](http://jsbin.com/vozulivitu/edit?js,output)

[Hello world with passFail reusable component](http://jsbin.com/moziseporo/edit?js,output) - [Modal component w/CSS Transitions](https://embed.plnkr.co/xK4TMqIuFeVjGso9KeV5/)

[Hello world (proxy w/Config)](http://jsbin.com/rasawehafo/edit?js,output) - [Without controller](http://jsbin.com/supihopabu/edit) - [Without config or controller](http://jsbin.com/lijolubuci/edit?js,output) - [Take2](http://jsbin.com/wudusixezo/edit?js,output)


*Events*

[Hello array lifecycle event](http://jsbin.com/webucanulu/edit?js,output)

[Lifecycle Disable & re-render](http://jsbin.com/toyubivuho/edit?js,output)

[Parent Eventing](http://jsbin.com/mireyonija/edit?js,output) - [Node switching](https://jsbin.com/goheyakiro/edit?js,output) - [Event handler in Child](http://jsbin.com/maqihifeje/edit?js,output)

[Count](http://jsbin.com/semilohoja/edit?js,output) - [Dynamic reusable counter component](http://jsbin.com/kisicoroya/edit?html,output) - [With shared state](http://jsbin.com/devehifote/edit?html,output)

*Lists*

[Simple List](http://jsbin.com/sewomabihe/edit?js,output) - [Reverse list](http://jsbin.com/samolezocu/edit?js,output)

[More lists](http://jsbin.com/mefefozaxe/edit?js,output)

[Sortable List](http://jsbin.com/ralutazaka/edit?js,output)

[Tiny filter](http://jsbin.com/reqigohete/edit?js,output)

[Filter list](http://jsbin.com/jokugejosa/edit?js,output) - [Leaderboard](http://jsbin.com/qatukoyuxu/edit?js,output)

[Filter list sort](http://jsbin.com/dedoferoqu/edit?js,output)

[Filter list components](http://jsbin.com/tuduzapecu/edit?js,output)

[List of Lists of items](https://embed.plnkr.co/VQkt0edRAy8AdIVUjvj8/)

[Loading and using external data](https://codepen.io/anon/pen/WEMzdZ?editors=0010)

*Modals*

[Tab component](http://jsbin.com/ziqivuceyu/edit?js,output) - [Take2](http://jsbin.com/yigijapexu/edit?js,output)

[Modal component](http://jsbin.com/yuyapesede/edit?js,output) - [Reusable Modal Component](http://jsbin.com/hayiparoko/edit?js,output)

[Modal with select menu](http://jsbin.com/yiyivasega/edit?js,output) - [Modal Child Component](https://codepen.io/anon/pen/brLMvm?editors=0010)

[Modal with external template shared appState](https://embed.plnkr.co/XquSnR8zDxZQflUIQb49/) - [Alternate with mag](https://embed.plnkr.co/IfMg4pEAUiIVU3YnA6wo/) - [Alternate with create](https://embed.plnkr.co/SjYWZRJMG8GaDFHp9OZn/) - [Addons vs Extends](https://embed.plnkr.co/H6RAodlcLD3yAbzAWZYf/) - [mag.template](https://embed.plnkr.co/N4xt0Z2cB3S8Qqqlvmfp/)

[Forms - composable components - link manager](http://jsbin.com/faqisutezo/edit?js,output)

[Todos](http://jsbin.com/mijixinuxu/edit?js,output) [Take2](http://jsbin.com/pexigilofo/edit?js,output) - [Take3](http://jsbin.com/yutedisesa/edit?html,js,output) - [Simple v0.2](http://jsbin.com/cehukabesi/edit?js,output) - [Simple v0.2 component](http://jsbin.com/tumupipede/edit?js,output), [Take2](http://jsbin.com/detehosene/edit?js,output) - [v0.24](http://jsbin.com/votisiwire/edit?html,output)

*Todos*

[Todo Proxy](http://jsbin.com/jotapujeho/edit?js,output)

[Todos (expanded)](http://jsbin.com/yimozefuma/edit?js,output)

[Contacts](http://jsbin.com/logikijuke/edit?js,output) - [Take 2](http://jsbin.com/gupebetati/edit?js,output)

[Async](http://jsbin.com/qukanukuko/edit?js,output)

[Async - Geo Location](http://jsbin.com/giquhayepe/edit?js,output)

[Infinity scroll](http://jsbin.com/tetazujeti/edit?html,output)

*Animation*

[CSS transitions](http://jsbin.com/nexovuriyu/edit?html,output) - [Animation, FadeIn, FadeOut](http://jsbin.com/seyiyarura/edit?html,js,output) - [Message Fader Component](http://jsbin.com/zaferaxuve/edit?html,output)

[Movie plotter service](http://jsbin.com/cayepomuhu/edit?html,output) - [Plot selection](http://jsbin.com/qacimaquju/edit?html,output)
 - [Radio selection](http://jsbin.com/boxukuqisu/edit?html,output)
 - [With spinner](http://jsbin.com/fanuvegapi/edit?html,output)

### Mithril 2 Mag
[Rotate Links](http://jsbin.com/tajogozite/edit?js,output) - [Alternate](http://jsbin.com/mabibixufu/edit?html,output) - [Web service](http://jsbin.com/fogajilocu/edit?html,output) - [Loader](http://jsbin.com/mizicojubi/edit?html,output)

[Pagination](http://embed.plnkr.co/sPbwAzVKD69ZVOW3yDg7/)

[Function composition - Todos](http://jsbin.com/wuruqasaxa/edit?html,output)

[Volunteer form application](http://embed.plnkr.co/lgms6KqkMWBTk2fTcwVb/)

[StopWatch](http://jsbin.com/mefuvebaca/edit?html,output)

[Shopping Cart](https://embed.plnkr.co/NQ9U8cmo304vfPIy4iHs/)

[Ajax Github Api](http://jsbin.com/noqibividi/edit)

[REM API - User list](https://embed.plnkr.co/Ci0CNC1121nEqqQpwVEH/)

[Simple Application](https://embed.plnkr.co/Wzcsnk710X3k3gUKaFpJ/) - [Tutorial](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/simple-application.md)

### React 2 Mag
[Getting started with React example](http://jsbin.com/xatixeraza/edit?js,output) - [Affix](http://jsbin.com/yiwafonene/edit?html,output) - [Controller default](http://jsbin.com/hujuwefoko/edit?js,output)

[Navigation menu](http://jsbin.com/fajobahaja/edit?js,output) - [As Component](http://jsbin.com/qonetujalo/edit?js,output)

[Timer](http://jsbin.com/jiwosereri/edit?html,output) - [Timer components](http://jsbin.com/zaqawiredi/edit?html,output)

[TabList - key components](http://jsbin.com/kikujecevu/edit?html,js,output) - [Without Binding](http://jsbin.com/nuzeledefa/edit?js,output)

[TabList module pattern - dynamic children keys](http://embed.plnkr.co/BBqYUo2Vq7H3FoUB3QA8/) - [Video Tutorial](https://www.youtube.com/watch?v=0XvXxw_S-fU&index=15&list=PLtWfKzAMcA-hcOkgjW3onCBM6vBw-PDOf)

[Real-time search](http://jsbin.com/secozicofa/edit?js,output) 
[Same with different code style - creative Mag.JS!](http://jsbin.com/vulujetesi/edit?js,output)

[FilterableProductTable/static version (Thinking in React tutorial)](http://jsbin.com/firevuzege/edit?js,output)

[FilterableProductTable (Thinking in React tutorial)](http://jsbin.com/puxafumibu/edit?html,output)

[Occlusion culling](http://embed.plnkr.co/gA8SbzIb6hDPmBjYDeYb/preview) - [Latest](http://embed.plnkr.co/89kobTyz9jqT5LHtl6VF/)

[Tab state (From Why React is Awesome)](http://embed.plnkr.co/zI0gNs6ijxcSUQTuM377/preview)

[Board Switcher](http://jsbin.com/lazupeququ/edit?js,output) - [Stateless board](http://jsbin.com/layuxisito/edit?js,output)

[Weather App](http://jsbin.com/yigarawudi/edit?js,output) [Take 2](http://jsbin.com/hexalehujo/edit?js,output)

[Comment Box](http://jsbin.com/ginuzisogi/edit?js,output) - 
[Video tutorial](https://youtube.com/watch?v=QEnyWHSsMFg) - [Take1](http://jsbin.com/wusuluvoki/edit?js,output),
[Take 2](http://jsbin.com/kuyaxamoru/edit?js,output) - [Take3 - MagJS v0.14](http://embed.plnkr.co/PY1KzIPwDiUpE4vyraeC/) - [Module Pattern](http://embed.plnkr.co/Yqe7q3y1ST5wu2yt1OpR/) [Video tutorial](https://www.youtube.com/watch?v=89TCVe0WyaI)

[Image app with AJAX](http://embed.plnkr.co/fQzaidtY4GvsKH2k2Dtq/)

[Employee Directory with tiny Router](http://embed.plnkr.co/VJq2DEflPX7VKQHba6Oa/) - [Take2](http://embed.plnkr.co/FtkDDQwSuH8LPhxP5JPF/) - [Latest](https://embed.plnkr.co/85gjoGFLKFz02VVCbECt/)

[News feed with undo state](http://embed.plnkr.co/XdMHLiZPxlTwk1mFMjjV/)

[Mag Redux implementation](http://embed.plnkr.co/39plzYcnwnqEhn5hI4vG/) 

[Mag Redux Async](http://embed.plnkr.co/YsZSrG9QPGoNyjhu1bf0/)

### Angular 2 Mag

[Todos](http://jsbin.com/fecicuviwa/edit?output)

[Order form](http://jsbin.com/ziguzidayi/edit?js,output)

[Navigation menu](http://jsbin.com/dedahasoda/edit?js,output)

[Switchable Grid](http://jsbin.com/vinopakoze/edit?html,output)

[Phone Gallery](https://embed.plnkr.co/S2h3iL3ynp5iyXQc2Y8k/)

[Contact Manager application](http://jsbin.com/quviresiva/edit?js,output) - [Take 2](http://jsbin.com/hofoxodofa/edit?js,output)

[Country App - JSON/Routing](http://embed.plnkr.co/sWe3JEMnBHp272dNzb1N/)

[More advanced examples](https://github.com/magnumjs/mag.js/blob/master/examples/README.md)

## [Jasmine Specs](https://rawgit.com/magnumjs/mag.js/master/tests/specRunner.html)

### State Scope 

The scope of a components state/selectors is limited to its template `elementId|Node`

A nested component, child of a parent, will not be effected by the parent's state element selectors.

[Statefull Example](http://jsbin.com/cemujisuga/edit?html,output) - [Stateless Example](http://jsbin.com/huyejuwuci/edit?html,output)

### Statefullness
When redrawing the view method is called.
To maintain statefulness we can use the controller method.
Plainly these are default values.

HTML for below examples:
```html
<div id="lister">
  <h2></h2>
  <ul>
    <li class="item"></li>
  </ul>
</div>
```

Example without controller
```javascript
mag.module('lister', {
  view: function(state, props, element) {
  state.item = [1, 2, 3]
  state.title = 'Lister'
    state.h2 = {
      _text: state.title,
      _onclick: function() {
        state.show = state.show ? !state.show : true
        state.item.reverse()
        state.title = 'Gister' + state.show
      }
    }
  }
})
```
Example with controller
```javascript
mag.module('lister', {
  controller: function(props) {
    this.item = [1, 2, 3]
    this.title = 'Lister'
  },
  view: function(state, props, element) {
    state.h2 = {
      _text: state.title,
      _onclick: function() {
        state.show = state.show ? !state.show : true
        state.item.reverse()
        state.title = 'Gister' + state.show
      }
    }
  }
})
```

This link displays both for comparison:
http://jsbin.com/fopunubogi/edit?html,output

You can see that the first one when clicked nothing is changed while the second is dynamic.
The reasons is simply because the controller is called once while the view is called on every redraw/action/state change.

Here's an alternative approach to the above that only uses a view method and no controller for a similar result:
http://jsbin.com/xayobawuxo/edit?html,output

Example with config and without controller 

```javascript
mag.module("lister", {
  view: function(state) {
    var name1 = 'Yo!',
      name2 = 'Joe!'
    state.h2 = {
      _config: function(node, isNew) {
        if (isNew) {
          state.span = name1
          state.item = [1, 2, 3]
        }
      },
      _onclick: function() {
        state.item.reverse()
        state.span = state.span == name1 && name2 || name1;
      }
    }
  }
})
```
This is similar to using a controller or onload.
Every element has a _config to act as onload for hookins.
It receives 4 arguments:
1. is the element itself
2. is a boolean stating if this is attaching or not, first run is always true, subsequent executions are always false
3. context is an object that can be used to pass values to the method itself on every iterative call
 - a. one available sub method of context is onunload e.g. context.onunload = fun is called when the element is removed from the dom.
 - - context.onunload (configContext, node, xpath)
4. Index- the x path based index of the element


### Simple API


#### mag.module (String domElementID|Element Node, Object ModuleDefinition, Optional Object DefaultProperties )
This is the core function to attach a object of instructions to a dom element, when called it is executed.

ModuleDefinition is the instructions it can have a controller and a view function.
```javascript
var component = {
  view: function (state, props, element) {
  }
}
```
view receives three arguments: state, props and element
* State is the object used to transpile the dom 
   - e.g. state.h1 ='Hello' converts the first h1 tag in the element to that value
* Props is the optional properties object passed to its mag.module definition
* Element is the node itself whose ID/Node was passed to its mag.module definition

The controller function has access to the original props as well as all life cycle events, it is only called once.

```javascript
var component = {
  controller: function (props) {
    this.didupdate = function (Element, currentProps, instanceId) {}
  },
  view: function (state, props, Element) {
   this.state, this.props, this.element
  }
}
```
`this` in the `view` has access to the 3 main properties of `this.state`, `this.props` and `this.element`
All `_on` events context is `this`

#### mag (String domElementID|Element Node, Object ModuleDefinition, Optional Object DefaultProperties)

This is a shortcut method to the internal makeClone function returned by `mag.module`

`returns` a function to run the module and template with given props.

```javascript
//Define Component:
var CounterComponent = {
  view: function(state, props) {
    state.div = "Count: " + props.count;
  }
}

//Wire it:
var Counter = mag('counter', CounterComponent);

//Run:
var Element = Counter({count: state.count});

//Attach to state:
state.counter = Counter({count: state.count});

//Reflect on the component
Counter.getProps() ..
```
[Example](http://jsbin.com/tamemaqogo/edit?js,output) - [Stateless](http://jsbin.com/denunilaba/edit?js,output)

`mag` can also be used to create [stateless components](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/stateless-components.md)  
Which are helpful in constructing the UI.

Note: There are subtle differences between `mag()` and `mag.module.`

- *Skips `mag.module` setup*
  - The major difference is that the normal setup in `mag.module` is not run on the template node. Therefore, the `instance` does not exist until it is called.
  - This means there is no pre-loading and caching in the UI and that it only runs on the template clone not the template itself. [Example with mag](http://jsbin.com/xagefoqaxo/edit?html,js,output) - [Direct with mag.module](http://jsbin.com/tukodebaci/edit?html,js,output) - [Same with mag.module](http://jsbin.com/lomilojece/edit?html,js,output) - [Clone with  key](http://jsbin.com/kipawutina/edit?html,js,output)
- *Each call to `mag()` with the same ID/Node reuses it by default*
 - `mag()` defaults to a reference and does not create unique keys for you automatically. [Example](http://jsbin.com/bomevigave/edit?js,output)
 - In order to reuse one instance uniquely you must pass a key via props. [Example](http://jsbin.com/pesuqacobe/edit?js,output) or use `mag.create` from the AddOns.
 - Or simply call `mag()` again. [Example](http://jsbin.com/honolebuho/edit?js,output) - [List](http://jsbin.com/vexihanuwi/edit?js,output) - [Defined](http://jsbin.com/dijedajego/edit?js,output) - [Button Factory](http://jsbin.com/kexekamozu/edit?js,output)

## Lifecycle methods

There are 8 life cycle events: willload, willgetprops, didload, willupdate, didupdate, isupdate, onbeforeunload, onunload

They each get the same 3 parameters, their context is the Object no need to bind to `this`:

- Element is the original module definition ID element
- newProps is the active state of the props, since the controller is only called once, the original props parameter contains  the original default values.
- instance ID - Internal Mag.JS ID, can be used for reflection
- [nextProps (4th argument in willgetprops, contains the next props)]
- [done() (4th argument in onbeforeunload, function to call when completed)]

To prevent default from any Life Cycle method- stop continued processing
`return false`


```javascript
this.willgetprops = function(node, currentProps, instanceId, nextProps) {
  if (currentProps == nextProps) {
    return false
  }
}
```

Optionally, all life cycle methods can also be Object methods
```js
var Component = {
  willload: function() {
    mag.merge(this.state, this.props)
    this.state.input = {
      _oninput: () => {
        this.state.name = this.state.hello ? ' ' + this.state.hello + '!' : '?'
      }
    }
  }
}
```
[Try it on JSBin](http://jsbin.com/rabafibuni/edit?js,output) - [With Props Update](http://jsbin.com/yinaxicixu/edit?js,output)

## Reflection

Use the live instance or an instance ID

```javascript
var instance = mag.module ('myElementId'|Element Node, component);
```

`Returns` a function Object that can be used to create a clone of the instance and the instances information such as InstanceID.

The function object to create a clone instance requires an index/key in its only parameter. When assigned to a `state` elementMatcher, MagJS does that for you.

These 8 methods are bound to the exact instance

`getId`
`draw` 
`getState`
`getProps`
`clones`
`destroy`
`subscribe` - multiple subscribers allowed! `returns` a remove function
`rafBounce([Optional  Boolean])` - returns Boolean. Use to change the rendering default engine of rAF throttle to rAF debounce

## Inner Reflection

`removeSelfFunc = mag.mod.onLCEvent('didupdate', instanceId, handlerFunc)`

Available on all life cycle methods for any instanceId multiple handlers per event and instanceID are accepted.

`returns` a remover function, call to stop the handler from being executed.

For inner reflection the instanceID is available in all lifecycle methods, Note that this is not the elementID but instead the internal MagJS ID for each component includes clones, example:

`mag.redraw(mag.getNode(mag.getId(instanceID)), instanceID, 1);`

#### mag.create (String elementID|Element Node, Object ModuleDefinition, Optional Object props) - In the [Addons](https://github.com/magnumjs/mag.js/blob/master/src/addons/README.md)

Wraps around `mag.module` to return a reference instance you can call later.
The reference function can also over write the defaults given in create usually it will only over write the props

```javascript
var myComponent = mag.create('mydomId', {}) // not executed

var instance = myComponent({props:[]}) // executed 
//add a props.key for a unique component instance or else each call reuses existing.

// instance contains 7 sub methods 

instance.getId();
//returns instance UID for MagJS
//Use mag.getId(instanceId) to get the Node id and mag.getNode(ID) to get the Node itself

instance.draw() // redraws that unique instance, wrap in setTimeout for async
// optional boolean to force redraw i.e. clear the instance's cache instance.draw(true)
// `returns` a Promise resolved on rAF

instance.getState();
//Returns a copy of the current state values of that instance - state is async 

instance.getProps();
//Returns a copy of the current props values of that instance, defaults to bound instance

instance.clones();
//v0.22.6 returns list of any clones with their associated instanceId, and its own subscribe handler.

instance.subscribe(function(state, props, node, previous){});
//v0.22.1 assign handler to an instance to be notified on unqiue changes after life cycle event `didupdate`

instance.destroy([Optional RemoveBoolean]);
//v0.23.5 - if optional remove boolean is true the entire node is removed.
// this calls all nodes config unloaders and the controllers onunload event which can preventDefault.

 instance.rafBounce([Optional  Boolean]);
 //v0.27.2 - returns Boolean flag - used to change the rendering default engine of raf throttle to raf debounce

// instance can be called directly with an index/key to clone the instance, usefull in data arrays
instance('myUniqueKeyIndex') // Usually not called directly, MagJS will create index when attached to state

// returns the live node clone
```

Normally there's no need to call the instance constructor function directly.
When passed to a state object MagJS will create the index for you with or without a key provided in props.

```javascript
state.myELementMatcher = myComponent({
  props: []
})

// array
state.myELementMatcher = [myComponent({
  props: [3, 2, 1]
}), myComponent({
  props: [1, 2, 3]
})]

//Array object
state.myELementMatcher = [{
  item: myComponent({
    props: [3, 2, 1]
  })
}, {
  item: myComponent({
    props: [1, 2, 3]
  })
}]
```


[JSBin example](http://jsbin.com/mumebujoyi/edit?html,output)

**Control redrawing flow**

#### mag.redraw (node Element, idInstance magId, optional force Boolean)
initiate a redraw manually

Optional boolean argument to force cache to be cleared

`returns` a Promise which is resolved when the requestAnimationFrame is run.

#### mag.begin ( int MagJS uid)

```javascript
var instance = mag.module('app', module)
mag.begin(instance.getId())
// run some long standing process without redrawing the module no matter what the state changes are
```

Once called the module will not run a redraw until the corresponding `mag.end(id)` is called even if `instance.draw()` is called and even with the optional `instance.draw(force true)`it will not run.

#### mag.end ( int MagJS uid)

```javascript
// run the redraw for the module
mag.end(instance.getId())
```
This will run the last redraw for the instance assuming the number of begins match the number of ends called.

If you call `mag.begin(id)` for the same instance ID twice you must call `mag.end(id)` the same number of times before it will run the redraw.

This is typically not necessary especially since MagJS runs updates to the module state very efficiently via the rAF (requestAnimationFrame)

#### rAF  `mag.rafRate`, `mag.rafBounce` AND `instance.rafBounce()`

Option to select the requestAnimationFrame rendering strategy.

There is an optional global `mag` integer (defaults to undefined) `mag.rafRate` this will effect the `utils.scheduleFlush` rAF refresh rate.

There is an optional global `mag` boolean (defaults to undefined) `mag.rafBounce` this will effect the `utils.scheduleFlush`

If set to `true` performance/speed in rendering is enhanced but there can be a loss of smoothness in the dom painting such as jerky rendering.

You can also set per `instance.rafBounce(Boolean)` the desired rAF, `true` is the debounce, `false` (default) is to throttle. 

`Returns` the current instance's boolean value.

[Try it on JSBin](http://jsbin.com/valejuyata/edit?output)

### state object

State is the object that is watched for changes and is used to transpile the related dom parent element ID

there are 5 ways to reference an element within a module
* class name
* tag name
* data-bind attribute value
* id
* or name attribute value

state.h1 will match the first h1 element within a module (element id or parent node)

```javascript
This: <h1></h1>
With: state.h1 = 'Hello!'
Makes: <h1>Hello!</h1>
```

state.$h1 will match all h1s - greedy matcher, default only selects the first

To change the class for an element

```javascript
This: <h1></h1>
With: state.h1 = { _class: 'header', _text : 'Hello!'} 
Makes: <h1 class="header">Hello!</h1>
```

_text and _html are used to fill an elements text node and not as an attribute below.

any prefix underscore will be an attribute except for _on that will be for events such as 

```javascript
state.h1 = { _onclick: function() { state.h1='clicked!' } } 
```
* Events are bound to the module instance `this`.
* `this` has `this.props`, `this.state` and `this.element`
* Events receive arguments in this order f(event, index, node, data)

#### Lists

Dealing with lists are simple and intuitive, including nested lists with dynamic user based values.

The first list element is used as the template for all new items on the list
For example:
```html
<ul><li class="item-template"></li></ul>
```

```javascript
state.li = [1,2]
```

Will render
```html
<ul>
  <li class="item-template">1</li>
  <li class="item-template">2</li>
</ul>
```

### Lists of Objects
```html
<ul><li class="item-template">People: <b class="name"></b></li></ul>
```
```javascript
state.li = [{name:'Joe'},{name:'Bob'}]
```

Will render
```html
<ul>
  <li class="item-template">People: <b class="name">Joe</b>
  </li>
  <li class="item-template">People: <b class="name">Bob</b>
  </li>
</ul>
```
### Nested Lists
```html
<ul>
  <li class="item-template">Project: <b class="projectName"></b>
    <ul>
      <li class="doneBy">
        <name/>
      </li>
    </ul>
    <tasks/>
  </li>
</ul>
```
```javascript
state['item-template'] = [{
    projectName: 'house cleaning',
    doneBy: [{
      name: 'Joe'
    }, {
      name: 'Bob'
    }],
    tasks: ['wash', 'rinse', 'repeat']
  }, {
    projectName: 'car detailing',
    doneBy: [{
      name: 'Bill'
    }, {
      name: 'Sam'
    }],
    tasks: ['wash', 'rinse', 'repeat']
  }]
```
Will render
```html
<ul>
  <li class="item-template">Project: <b class="projectName">house cleaning</b>
    <ul>
      <li class="doneBy">
        <name>Joe</name>
      </li>
      <li class="doneBy">
        <name>Bob</name>
      </li>
    </ul>
    <tasks>wash</tasks>
    <tasks>rinse</tasks>
    <tasks>repeat</tasks>
  </li>
  <li class="item-template">Project: <b class="projectName">car detailing</b>
    <ul>
      <li class="doneBy">
        <name>Bill</name>
      </li>
      <li class="doneBy">
        <name>Sam</name>
      </li>
    </ul>
    <tasks>wash</tasks>
    <tasks>rinse</tasks>
    <tasks>repeat</tasks>
  </li>
</ul>
```
[Try it on JSBin](http://jsbin.com/coyemiwupu/edit?html,output)


**Data binding List with user input**

This is the power and intuitive nature of MagJS.
This is what allows for effortless and rapid HTML template prototyping.

With a minimal amount of code and a single row HTML template we can create a dynamic data table list that automatically stays up to date with dynamic values such as user input.

We start with our pure HTML template:

```html
<div id="tickets">
    <h2>How many tickets?</h2>
    <table>
      <tbody>
        <tr class="ticketTypeRow">
          <th class="ticketType">
            Senior
          </th>
          <td class="numberofTickets">
            <input name="quantity" type="number" min="0" maxlength="2" size="1">
          </td>
          <td class="timesX">x</td>
          <td>$ <span class="pricePerTicket"></span>
          </td>
          <td class="equals">= $</td>
          <td class="rowTotal">
            <input name="total" size="8" readonly="readonly" tabindex="-1" value="0.00">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
```

Next we have our JavaScript data list:

```js
var defaultProps = {
  ticketTypeRow: [{
    quantity: 0,
    ticketType: 'senior',
    total: 0.00,
    pricePerTicket: 5.99
  }, {
    quantity: 0,
    ticketType: 'adult',
    total: 0.00,
    pricePerTicket: 5.99
  }, {
    quantity: 0,
    ticketType: 'child',
    total: 0.00,
    pricePerTicket: 3.99
  }]
}
```

Where this data comes from or how it is loaded does not effect MagJS in any way. It can be async, iframe, web service, push, io sockets etc...

Normally we would mutate the data in some way through the native Array.map function to return a new Array that is bound by MagJS to our HTML template. In this example we are showing how that is not necessary.

Next, we create our module. 

```js
var Tickets = {}

Tickets.controller = function(props) {
  // merge the props with the module's state/html
  mag.utils.merge(this, props);
}

Tickets.view = function(state, props) {

  state.$quantity = {
    _onInput: function(event, index, node, data) {
      var total = state.ticketTypeRow[data.index].quantity * state.ticketTypeRow[data.index].pricePerTicket
      state.ticketTypeRow[data.index].total = total
    }
  }
}
```

As you can see we are not changing the props data array instead we are merging it directly into our state selectors.

Lastly we will now load the module for MagJS to do the DOM bindings:

```js
mag.module("tickets", Tickets, defaultProps)
```

Try it on JSBin:
[Movie ticket quantity selection](http://jsbin.com/wohovemaqa/edit?js,output) - [Nested math input](http://jsbin.com/nabaqawato/edit?js,output) - [Nested messaging components](http://jsbin.com/rometunegi/edit?js,output)

  
#### Attributes
_html, _text, _on[EVENT], _config->context.onunload

to not overwrite an existing attribute use: 

state.name._value = state.name._value + ''

event (e, index, node, data) default context is the target element

* index is the xpath index of the node -1
* data is the index data of the parent if in a list (map{path,data,node,index})
* if promise is returned it will defere redraw until resolved

#### Events

Life cycle events in controller:

* willload (node, props, instanceID)
* willgetprops (node, props, instanceID, nextProps)
* didload (node, props, instanceID)
* willupdate (node, props, instanceID)
* didupdate (node, props, instanceID)
* isupdate (node, props, instanceID)
* onbeforeunload  (node, props, instanceID, done)
* onunload (node, props, instanceID)

`return false` - will skip further execution.

It will call any onunload handlers in the current module (includes inner modules and _config onunloaders that are currently  assigned)

controller -> this.willload 

### Native events: parameters - 
```state.matcher._onclick = function(e, index, node, data)```

* the event
* the x path based 0 index
* the node itself (default context)
* the data of the closest parent list item (In nested lists, the first parent with data).

## Config (DOM hookin)
_config (node, isNew, context, index)

Available on all matchers to hookin to the DOM 

arguments :

* node - the element itself

* isNew is true initially when first run and then is false afterwards

* context is a empty object you can use to pass to itself

   - context.onunload - will be attached to the current modules onunloaders and called if any lifecycle event triggers a stop by returning false

* index is 0 based on xpath of the matcher

#### mag.hookin (type, key, handler)
Allows for custom definitions, see examples [below](//github.com/magnumjs/mag.js/blob/master/README.md#custom-plugins) 
Examples: Promise, binding, custom attributes and elements.. [Hookins](https://github.com/magnumjs/mag.js/blob/master/src/hookins/README.md)

#### Mag.JS AddOns!

Tiny sub library of reusable simple tools can be found [here](https://github.com/magnumjs/mag.js/blob/master/src/mag.addons.0.2.js)

* router
* ajax
* Reusable utilities (copy, merge .. )
* namespace
* hookins


#### mag.namespace (String namespace, [Optional object Context])

```javascript
//module library creation with single global namespace / package names
(function(namespace) {
  var mod = {
    controller:function(props){
    },
    view: function(state, props) {
    }
  }
  namespace.CommentBox = mod;
})(mag.namespace('mods.comments'));


var CommentsComponent = mag.create("CommentBox", mag.mod.comments, props);
CommentsComponent();
```

Allows you to easily add new namespaces to your composable components, useful in the module pattern.

[Example of component Module Pattern](http://embed.plnkr.co/iCPpw4NxQEK2ddyqwJ0U/) - [Video tutorial](https://www.youtube.com/watch?v=89TCVe0WyaI)

#### Custom plugins

The ability to register handlers for attribute or value trans compilation.

For example, allow the attribute _className. Register a handler that on every definition will modify both the final attribute name and or the value.

```javascript
mag.hookin('attributes', 'className', function(data) {
  var newClass = data.value
  data.value = data.node.classList + ''
  if (!data.node.classList.contains(newClass)) {
    data.value = data.node.classList.length > 0 ? data.node.classList + ' ' + newClass : newClass
  }
  data.key = 'class'
})
```

The above is in the [MagJS addons library](https://github.com/magnumjs/mag.js/blob/master/src/mag.addons.0.2.js)

**Another example**

Hookin when a specific elementMatcher is not found and return a set of element matches

```javascript
// hookin to create an element if does not exist at the root level
mag.hookin('elementMatcher', 'testme', function(data) {
  // data.key, data.node, data.value

  var fragment = document.createDocumentFragment(),
    el = document.createElement('div');
    
  el.setAttribute('class', data.key)
  fragment.appendChild(el);

  var nodelist = fragment.childNodes;
  data.node.appendChild(fragment)

  data.value = nodelist
})
```

Other hookins such as key/node value!

### [Check out the Hookins](https://github.com/magnumjs/mag.js/blob/master/src/hookins/README.md)

## Extends

Example of extending the core Mag.JS functionality seamlessly

*Allow for external template loading:*

```javascript
//Syntax via mag.template extends
mag.module('template.html', {view: ()});
mag('template.html', {view: ()});

mag.module({templateUrl: 'template.html', view: ()});
mag({templateUrl: 'template.html', view: ()});
```
### [Check out the core Extends](https://github.com/magnumjs/mag.js/blob/master/src/extends/README.md)

#### Notes

* config attribute won't be called with inner id element matchers, use other element matcher selectors. Fixed in v0.25.5 [Example](http://jsbin.com/qoxuvahake/edit?js,output)

* careful with module instance constructor, can stack overflow if circular reference. Don't call instance from within itself or on state, use separate module. See examples. Fixed: MagJS will throw a Error if it detects recursivity (a instance call within an instance call) - [Try it on JSBin](http://jsbin.com/gakirunila/edit?js,output)

* object observe support for browsers (v0.22 uses native Proxy to observe)

```html
<script src="//cdn.rawgit.com/MaxArt2501/object-observe/master/dist/object-observe-lite.min.js"></script>
```

* Promise support for IE

```html
<!--[if IE]><script src="https://cdn.rawgit.com/jakearchibald/es6-promise/master/dist/es6-promise.min.js"></script><![endif]-->
```


### Performance
[JSBin - dynamic re-rendering](http://jsbin.com/momuxogicu/edit?output) - [v0.20.7](http://jsbin.com/jayodatiqa/edit?output) - [v0.21.3](http://jsbin.com/sopumorire/edit?output) - [v0.22](http://jsbin.com/sononayaro/edit?output) - [Latest](http://jsbin.com/tilujedala/edit?js,output) - [Toggle rAF (Throttle vs Debounce)](http://jsbin.com/valejuyata/edit?output)

[Occlusion culling](http://embed.plnkr.co/gA8SbzIb6hDPmBjYDeYb/preview) - [v0.22](http://embed.plnkr.co/OX88w963dxC6jCZLELoD/) - [Latest](https://embed.plnkr.co/89kobTyz9jqT5LHtl6VF/) - [Throttle rAF rate](https://embed.plnkr.co/oRDUCHjuCFSYwL9yeimg/) - [Debounce](https://embed.plnkr.co/F4b3exUGNKDeURikojqA/)

[JSBin - reversing 1000s of rows](http://jsbin.com/lubimetope/edit?js,output) - [v0.22](http://output.jsbin.com/qacawokejo) - [Latest](http://jsbin.com/wulajemuro/edit?output) - [Optimized](http://jsbin.com/suxijorivo/edit?output) - [Componentized](https://embed.plnkr.co/8pFwdnzmEf7IGIlTL1ab/)

[Dbmon Repaint rate](http://mathieuancelin.github.io/js-repaint-perfs/magjs/) - [v0.23](http://embed.plnkr.co/4wi2bXj2WxeUe27yoXOS/) -  [Latest](https://embed.plnkr.co/axjFPUXLqzATXFCMAtT5/)

[JsPerf v0.20.2](http://jsperf.com/react-vs-raw-dom-manipulation/20) - 
[JsPerf v0.20.2](https://jsperf.com/angular-vs-knockout-vs-ember/758)

[JsPerf v0.20.3](http://jsperf.com/react-vs-raw-dom-manipulation/21) - 
[JsPerf v0.20.3](https://jsperf.com/angular-vs-knockout-vs-ember/759)

[JSPerf v0.14.4](http://jsperf.com/angular-vs-knockout-vs-ember/690)  
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/690"><img src="https://cloud.githubusercontent.com/assets/5196767/9841719/7b46329a-5a71-11e5-8ab2-2f4a1120d949.png"/></a>

[JSPerf v0.14.9](http://jsperf.com/angular-vs-knockout-vs-ember/695)
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/695"><img src="https://cloud.githubusercontent.com/assets/5196767/9858046/62a28128-5aec-11e5-86c0-03bc34268cbc.png"/></a>

[JSPerf v0.15](http://jsperf.com/angular-vs-knockout-vs-ember/694)
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/694"><img src="https://cloud.githubusercontent.com/assets/5196767/9859912/e0e29834-5af6-11e5-8bc1-c9b467d3fd25.png"/></a>

[JSPerf v0.15.1](http://jsperf.com/angular-vs-knockout-vs-ember/700)
<a href="http://jsperf.com/angular-vs-knockout-vs-ember/700"><img src="https://cloud.githubusercontent.com/assets/5196767/9866345/60295bf4-5b2f-11e5-8c51-a73e47c7ac2c.png"/></a>

### Inspired By & cloned from

[Mithril.js](http://lhorie.github.io/mithril/), [Fill.js](https://github.com/profit-strategies/fill),  [React.js](https://facebook.github.io/react/), [Angular.js](https://angularjs.org/), [Fastdom](https://github.com/wilsonpage/fastdom)
