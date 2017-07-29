# Compositional Inheritance

MagJS has a powerful composition model, and we recommend using composition with inheritance to reuse code between components.

In this section, we will consider a few problems for developers new to MagJS and show how we can solve them with compositional inheritance.

# Containment

Some components don't know their children ahead of time. This is especially common for components like Sidebar or Dialog that represent generic "boxes".

We recommend that such components have a special `children` prop to pass children elements directly into their output:

```html
<div id="root">

  <mydialog></mydialog>

  <div class="templates hide">
    <div id="fancy-border">
      <div>
        <div class="children"></div>
      </div>
    </div>
    
    <div id="dialog">
      <h1 class="Dialog-title">
        Welcome
      </h1>
      <p class="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </div>
  </div>

</div>
```
This lets other components pass arbitrary children to them by:

```js
var FancyBorder = {
  view: function(state, props) {
    state.div = {
      _class: 'FancyBorder FancyBorder-' + props.color
    };
    state.children = props.children;
  }
}
```

```js
var Dialog = {
  controller: function(props) {
    this.h1 = props.title;
    this.p = props.message;
  }
}
```


```js
mag.module('root', {
  controller: function() {
    this.mydialog = mag('fancy-border', FancyBorder, {
      color: 'blue',
      children: mag('dialog', Dialog)
    });
  }
});
```


[Try it on JSBin](http://jsbin.com/teheqareci/edit?js,output)

# Specialization

Sometimes we think about components as being "special cases" of other components. For example, we might say that a `WelcomeDialog` is a special case of `Dialog`.

In MagJS, this is also achieved by composition, where a more "specific" component renders a more "generic" one and configures it with props:

```html
<div id="root">

  <mydialog></mydialog>

  <div class="templates hide">

    <div id="fancy-border">
      <div>
        <div class="children"></div>
      </div>
    </div>

    <div id="dialog">
      <h1 class="Dialog-title">
        Welcome
      </h1>
      <p class="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
      <div class="children"></div>
    </div>

    <div id="signup">
      <input>
      <button>
        Sign Me Up!
      </button>
    </div>
  </div>

</div>
```

```js
var FancyBorder = {
  view: function(state, props) {
    state.div = {
      _class: 'FancyBorder FancyBorder-' + props.color
    };
    state.children = props.children;
  }
}

var Dialog = {
  controller: function(props) {
    this.h1 = props.title;
    this.p = props.message;
    this.children = props.children;
  }
}

var SignUp = {
  view: function(state, props) {
    state.button = {
      _onClick: function() {
        alert("Welcome aboard, " + state.input + "!");
      }
    }

  }
}
```

```js
mag.module('root', {
  controller: function() {
    this.mydialog = mag('fancy-border', FancyBorder, {
      color: 'blue',
      children: mag('dialog', Dialog, {
        children: mag('signup', SignUp)
      })
    });
  }
});
```

[Try it on JSBin](http://jsbin.com/zorihiyefi/edit?js,output)
