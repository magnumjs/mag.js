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

[JSBin](http://jsbin.com/licerahipi/edit?js,output)

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
<div className="commentList">
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
<div className="commentForm">
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
<div className="comment">
  <h2 className="commentAuthor">
    {this.props.author}
  </h2>
  {this.props.children}
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
<div className="commentList">
  <Comment author="Pete Hunt">This is one comment</Comment>
  <Comment author="Jordan Walke">This is *another* comment</Comment>
</div>
```
      
```javascript
var CommentList = {
  view: function() {
  }
}
```
