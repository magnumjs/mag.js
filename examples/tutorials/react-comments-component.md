#Tutorial

We'll be building a simple but realistic comments box that you can drop into a blog, a basic version of the realtime comments offered by Disqus, LiveFyre or Facebook comments.

We'll provide:

* A view of all of the comments
* A form to submit a comment
* Hooks for you to provide a custom backend

It'll also have a few neat features:

* **Optimistic commenting:** comments appear in the list before they're saved on the server so it feels fast.
* **Live updates:** other users' comments are popped into the comment view in real time.

##Want to skip all this and just see the source?

[JSBin](http://jsbin.com/totuxamale/edit?js,output)

##Getting started

For this tutorial, we'll use the latest prebuilt JavaScript file. Open up your favorite editor and create a new HTML document:

```html
<html>
  <head>
    <title>Hello MagJS</title>
    <script src="//rawgit.com/magnumjs/mag.js/master/mag.min.js"></script>
  </head>
  <body>
    <div id="content"></div>
    <script>
      // Your code here
    </script>
  </body>
</html>
```

##Your first component

MagJS is all about modular, composable components. For our comment box example, we'll have the following component structure:

```html
- CommentBox
  - CommentList
    - Comment
  - CommentForm
```

Let's build the CommentBox component, which is just a simple div tag:

```html
<div id="commentBox">
  Hello, world! I am a CommentBox.
</div>
```

Note that ID is required for modules

```javascript
// view method is required
var CommentBox = {
  view: function() {
  }
}

mag.module('CommentBox',CommentBox)
```

**What's going on**

We pass some methods in a JavaScript object to mag.module() to create a new component. The most important of these methods is called view which returns a promise tree of MagJS components that will eventually render to HTML with all inner element matcher transpilations.

The html is plain html no scripts or tempalte special syntax. the JavaScript is just plain javascript no special syntax, sugar or new api to learn.

You do not have to return. You can call a tree of components that you (or someone else) built. This is what makes MagJS composable: a key tenet of maintainable frontends.

mag.module() instantiates the root component, starts the framework, and injects the transpilations into the associated DOM element, provided as the second argument.

##Composing components

Let's build skeletons for CommentList and CommentForm which will, again, be simple div tags:

```html
<div id="commentList">
  Hello, world! I am a CommentList.
</div>
```

```javascript
// tutorial2.js
var CommentList = {
  view: function() {

  }
}
```
```html
<div id="commentForm">
  Hello, world! I am a CommentForm.
</div>
```

```javascript
var CommentForm = {
  view: function() {

  }
}
```

Next, update the CommentBox component to use these new components:

```html
<div id="commentBox">
  <h1>Comments</h1>
  <CommentList />
  <CommentForm />
</div>
```

```javascript
var CommentBox = {
  view: function(state) {
  
    state.CommentList = mag.module('CommentList',CommentList)
    state.CommentForm = mag.module('CommentForm',CommentForm)
    
  }
}
```

Notice how we're mixing HTML tags and components we've built. HTML components are regular MagJS components, just like the ones you define, with one difference. The fill compiler will automatically render HTML results of the components into its new container. This is to prevent the pollution of the global namespace.

##Using props

Let's create the Comment component, which will depend on data passed in from its parent. Data passed in from a parent component is available as a 'property' on the child component. These 'properties' are accessed through "props". Using props, we will be able to read the data passed to the Comment from the CommentList, and render some markup:

```html
<div id="comment">
  <h2 className="author">
    {props.author}
  </h2>
  <text/>
</div>
```

```javascript
var Comment = {
  view: function() {
  }
}
```

Don't be fooled by the braces, these are just placeholders there is NO templating syntax to learn in MagJS. You can drop text or MagJS components into the tree. We access named attributes passed to the component as keys on "props" and any nested elements.

##Component Properties

Now that we have defined the Comment component, we will want to pass it the author name and comment text. This allows us to reuse the same code for each unique comment. Now let's add some comments within our CommentList:

```html
<div id="commentList">
  <Comment></Comment>
</div>
```
      
```javascript
var CommentList = {
  view: function(state) {
    state.Comment = mag.module('comment', Comment,{
      author:'Mike Glazer',
      text:'This is one comment'
    })
  }
}
```

Note that we have passed some data from the parent CommentList component to the child Comment components. For example, we passed Mike Glazer (via an attribute) and This is one comment (via an XML-like child node) to the first Comment. As noted above, the Comment component will access these 'properties' through props.author, and props.comment.

##Hook up the data model

So far we've been inserting the comments directly in the source code. Instead, let's render a blob of JSON data into the comment list. Eventually this will come from the server, but for now, write it in your source:

```javascript
var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];
```

We need to get this data into CommentList in a modular way. Modify CommentBox and the mag.module() call to pass this data into the CommentList via props:

```html
<div id="commentBox">
  <h1>Comments</h1>
  <CommentList />
  <CommentForm />
</div>
```

```javascript
var CommentBox = {
  view: function(state, props) {
    state.CommentList = mag.module('commentList', CommentList, {data:data})
  }
}

mag.module('CommentBox',CommentBox {data:data})
```

Now that the data is available in the CommentList, let's render the comments dynamically:

```html
<div id="commentList">
  <Comments/>
</div>
```

```javascript
var CommentList = {
  view: function(state, props) {
    state.Comments = props.data.map(function (comment) {
    // the last argument 'true' tells MagJS to make a clone of this component
      return mag.module('comment', Comment, {comment:comment}, true)
    });
  }
}
```
That's it!

##Fetching from the server

Let's replace the hard-coded data with some dynamic data from the server. We will remove the data prop and replace it with a URL to fetch:

##Reactive state

So far, each component has rendered itself once based on its props. props are immutable: they are passed from the parent and are "owned" by the parent. To implement interactions, we introduce mutable state to the component. state is private to the component and can be changed by calling "state". When the state is updated, the component re-renders itself.

view() methods are written declaratively as functions of "props" and "state". The framework guarantees the UI is always consistent with the inputs.

When the server fetches data, we will be changing the comment data we have. Let's add an array of comment data to the CommentBox component as its state:

```html
<div id="commentBox">
  <h1>Comments</h1>
  <CommentList />
  <CommentForm />
</div>
```

```javascript
var CommentBox = {
  controller: function() {
    return {data: []};
  },
  view: function(state, props) {
    
    state.commentList = state.data
    
  }
}
```

controller() executes exactly once during the lifecycle of the component and sets up the initial state of the component.

##Updating state

When the component is first created, we want to GET some JSON from the server and update the state to reflect the latest data. In a real application this would be a dynamic endpoint, but for this example, we will use a static JSON with setTimeout to keep things simple:

```javascript
var data = [
  {"author": "Pete Hunt", "text": "This is one comment"},
  {"author": "Mike Glazer", "text": "This is *another* comment"}
]
```

```html
<div id="commentBox">
  <h1>Comments</h1>
  <CommentList />
  <CommentForm />
</div>
```

```javascript
var CommentBox = {
  controller: function(props) {
    setTimeout(function(){
      this.data =  props.data
    },10);
  },
  view: function(state, props) {
    state.CommentList = mag.module('CommentList', CommentList,{data:state.data})
  }
}

mag.module('CommentBox','CommentBox',{data:data})
```

Here, controller is a method called automatically by MagJS when a component is loaded. The key to dynamic updates is the attachement to the state object which is the "this" in the controller. We replace the old array of comments with the new one from the server and the UI automatically updates itself. Because of this reactivity, it is only a minor change to add live updates. We can use simple polling or you could easily use WebSockets or other technologies.

##Adding new comments

Now it's time to build the form. Our CommentForm component should ask the user for their name and comment text and send a request to the service to save the comment.

```html
<form id="commentForm">
  <input type="text" placeholder="Your name" />
  <input type="text" placeholder="Say something..." />
  <input type="submit" value="Post" />
</form>
```

Let's make the form interactive. When the user submits the form, we should clear it, submit a request to the server, and refresh the list of comments. To start, let's listen for the form's submit event and clear it.

```javascript
var CommentForm = {
  controller: function(props){
    this.author = mag.prop('')
    this.text = mag.prop('')
    
    this.handleSubmit = function(e) {
      e.preventDefault();
      if (this.author() && this.text()) {
        // clear fields
        document.querySelector('[name="author"]').value = this.author('')
        document.querySelector('[name="text"]').value = this.text('')
        return;
      }
    }.bind(this)
    
  },
  view:function(state, props){
   state.form = {
      _onchange: function(e) {
      // bind form values to our gettersetters
        state[e.target.name](e.target.value)
      },
      _onsubmit: state.handleSubmit
    }
  }
}
```

**Events**
MagJS attaches event handlers to components using a leading underscore to denote an attribute. We attach an onSubmit handler to the form that clears the form fields when the form is submitted with valid input.

Call preventDefault() on the event to prevent the browser's default action of submitting the form.

**Callbacks as props**
When a user submits a comment, we will need to refresh the list of comments to include the new one. It makes sense to do all of this logic in CommentBox since CommentBox owns the state that represents the list of comments.

We need to pass data from the child component back up to its parent. We do this in our parent's render method by passing a new callback (handleCommentSubmit) into the child, binding it to the child's onCommentSubmit event. Whenever the event is triggered, the callback will be invoked:

```javascript
var CommentBox = {

  controller: function() {
    setTimeout(function(){
      this.data =  props.data
    },10);
    this.handleCommentSubmit = function(){
      // TODO: submit to the server and refresh the list
    }
  }
  view: function() {

    state.CommentList = mag.module('CommentList', CommentList,{data:state.data})
    state.CommentForm = mag.module('CommentForm', CommentForm,{onCommentSubmit:state.handleCommentSubmit})

  }
}
````

Let's call the callback from the CommentForm when the user submits the form:

```javascript
var CommentForm = {
  controller: function(props){
    this.author = mag.prop('')
    this.text = mag.prop('')
    
    this.handleSubmit = function(e) {
      e.preventDefault();
      if (this.author() && this.text()) {
        props.onCommentSubmit({author: this.author(), text: this.text()});
        // clear fields
        document.querySelector('[name="author"]').value = this.author('')
        document.querySelector('[name="text"]').value = this.text('')
        return;
      }
    }.bind(this)
    
  },
  view:function(state, props){
   state.form = {
      _onchange: function(e) {
      // bind form values to our gettersetters
        state[e.target.name](e.target.value)
      },
      _onsubmit: state.handleSubmit
    }
  }
}
````

Now that the callbacks are in place, all we have to do is submit to the server and refresh the list:

```javascript
var CommentBox = {

  controller: function() {
      //simulate async server side request 
      // load initial comments
    this.willload = function(node) {
      setTimeout(function(){
        this.data =  props.data || []
      },10);
    }.bind(this)
    //save posted comments
    this.handleCommentSubmit = function(comment){
      //simulate async server side request 
      setTimeout(function(){
        this.data.push(comments)
      },10);
    }
  }
  view: function() {
````

##Optimization: optimistic updates

Our application is now feature complete but it feels slow to have to wait for the request to complete before your comment appears in the list. We can optimistically add this comment to the list to make the app feel faster.

```javascript
var CommentBox = {

  controller: function() {
      //simulate async server side request 
      // load initial comments
    this.willload = function(node) {
      setTimeout(function(){
        this.data =  props.data || []
      },10);
    }.bind(this)
    //save posted comments
    this.handleCommentSubmit = function(comment){
      // optimistically add new comment to state
      // will refresh once server is done too
      var comments = this.data
      var newComments = comments.concat([comment])
      this.data= newComments
      
      //simulate async server side request 
      setTimeout(function(){
        this.data.push(comment)
      },10);
    }
  }
  view: function() {
````

##Congrats!

You have just built a comment box in a few simple steps. Learn more about why to use MagJS, or dive into the API reference and start hacking! Good luck!

[MagJS version of James Longs' "why react is awesome"](https://rawgit.com/magnumjs/mag.js/master/examples/tutorials/james-awesome.html)

[JSBin](http://jsbin.com/totuxamale/edit?js,output)
