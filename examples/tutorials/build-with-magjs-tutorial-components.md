# Tutorial: Components

Components are the heart and soul of MagJS.

**Need to know**

MagJS allows for lots of creative ways to use and manipulate components, let's go over the basics:

Three ways to create components:

1. `mag.module()` is the most common way. It will execute the Object methods on the Element: `mag.module(Element | ID, Object{controller, view})`
Note: it only accepts Object Components and IDs or the Element itself. It is statefull and efficient (rAF & caching).
Returns the Components instance with access to internal methods such as `getProps()`, `getid()` .. [See API](https://github.com/magnumjs/mag.js#simple-api)

2. `mag()` is more versatile but does not execute immediately. Instead it returns a function that can be called with `props` to pass: 
`var component = mag('container', {controller, view}); component()`
Note: `mag()` does not affect the original template instead it returns a live clone of the Element.

3. `mag()` can also be used with a function that has no state "stateless components":
`mag('root, (props)=>({div: "Hello!"}));`
Note: do not use IDs with stateless components since the ID will not be unique. You can use a live Node, a string className or tagName.
It does not use the rAF and re-renders completely if props have changed when called.

```js
// Create a component named MessageComponent
var MessageComponent = mag.module(document.body, {
  view: function(state, props) {
    state.div = props.message;
  }
});

// Render an instance of MessageComponent into document.body
MessageComponent.getProps().message= "Hello!";
```

Create a new component using `mag.module`. 
Components have one requirement; they must implement view, a function that tells the component what to... view.
I honestly couldn't think of another word.

[Try it on JSBin](http://jsbin.com/sogumihade/edit?js,output) - [Without instance](http://jsbin.com/gadebucaje/edit?js,output) - [Stateless](http://jsbin.com/qagegoyeba/edit?js,output)

## Props

Props are half of what make MagJS components special. (Don't worry. I won't spoil the other half until later.)

In fact, you've already been introduced to props. 
The attributes you were setting earlier, like className, were props! 
When a component is rendered, it can access its "props" using the props argument. 
In the code above, the Message component uses props.message.

```js
view: function(state, props) {
  state.div = props.message;
}
```
 
<hr>
  
## Exercise: Props

Create a `VacancySign` component that has a boolean prop `hasvacancy`. 
The component should render a div with either the text "Vacancy" or "No Vacancy" depending on the prop.

 ```js
var VacancySign = null; // Create your component here

// Once you create your component, render your component and try both states.
mag.module(document.getElementById('container'),{
view: function(state, props){
  state.div = "Replace me";
  }
});
```

[Try it on JSBin](http://jsbin.com/goqagujolo/edit?js,output) - [View Solution](http://jsbin.com/nolozidoci/edit?js,output)

If that was easy, experiment a little.
Try creating another component that renders your VacancySign component and rendering that to the body instead.
Then try doing it in the 3 different components variations mentioned above.

<hr>

**NEXT ARTICLE**
**Events**

What fun is a static page? Add events to make it interactive and all sorts of other buzzy adjectives!

[Continue]()
