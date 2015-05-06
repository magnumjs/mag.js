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
