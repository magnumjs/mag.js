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
