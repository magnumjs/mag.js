#Mag.JS


# Simple application

Let's develop a simple application that covers some of the major aspects of Single Page Applications

First let's create an entry point for the application. Create a file `index.html`:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>My Application</title>
	</head>
	<body>
		<script src="app.js"></script>
	</body>
</html>
```

[Full working example](https://embed.plnkr.co/OVRbv4bH3GmGxvBRuZWd/)

The `<!doctype html>` line indicates this is an HTML 5 document. The first `charset` meta tag indicates the encoding of the document and the `viewport` meta tag dictates how mobile browsers should scale the page. The `title` tag contains the text to be displayed on the browser tab for this application, and the `script` tag indicates what is the path to the Javascript file that controls the application.

---

To install Mag.JS, fork the plunker [boilerplate](https://github.com/magnumjs/mag.js#boilerplates). Once you have a project skeleton with Mag.JS ready, we are ready to create the application.

Let's start by creating a module to store our state. Let's create a file called `User.js`

```javascript
// User.js
var User = {
	list: []
}
```

Now let's add code to load some data from a server. To communicate with a server, we can use Mag.JS's XHR utility, `mag.request`. First, we include Mag.JS addons on the index.html page:

```javascript
<script src="//rawgit.com/magnumjs/mag.js/master/dist/mag.addons.0.22.min.js"></script>
```

Next we create a function that will trigger an XHR call. Let's call it `loadList`

```javascript
// User.js

var User = {
	list: [],
	loadList: function() {
		// TODO: make XHR call
	}
}
```

Then we can add an `mag.request` call to make an XHR request. For this tutorial, we'll make XHR calls to the [REM](http://rem-rest-api.herokuapp.com/) API, a mock REST API designed for rapid prototyping. This API returns a list of users from the `GET http://rem-rest-api.herokuapp.com/api/users` endpoint. Let's use `mag.request` to make an XHR request and populate our data with the response of that endpoint.

```javascript
// User.js

var User = {
	list: [],
	loadList: function() {
		return mag.request({
			method: "GET",
			url: "http://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
			return result;
		})
	},
}
```

The `method` option is an [HTTP method](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods). To retrieve data from the server without causing side-effects on the server, we need to use the `GET` method. The `url` is the address for the API endpoint. The `withCredentials: true` line indicates that we're using cookies (which is a requirement for the REM API).

The `mag.request` call returns a Promise that resolves to the data from the endpoint. By default, Mag.JS assumes a HTTP response body are in JSON format and automatically parses it into a Javascript object or array. The `.then` callback runs when the XHR request completes. In this case, the callback assigns the `result.data` array to `User.list`.

Notice we also have a `return` statement in `loadList`. This is a general good practice when working with Promises, which allows us to register more callbacks to run after the completion of the XHR request.

This simple model exposes two members: `User.list` (an array of user objects), and `User.loadList` (a method that populates `User.list` with server data).

---

Now, let's create a view module so that we can display data from our User model module.

Create a file called `UserList.js`. First, let's include Mag.JS and our model, since we'll need to use both:

```javascript
// UserList.js

```

Next, let's create a Mag.JS component. A component is simply an object that has a `view` method:

```javascript
// UserList.js

var UserList = {
	view: function(state, props) {
		// TODO add code here
	}
}
```

By default, Mag.JS views use two arguments the `props` sent to the Component and the `state` which is the elementMatchers within the Component you set the data to.

Let's use Mag.JS state to create a list of items.:

```javascript

var UserList = {
	view: function(state, props) {
		state.a = [];
	}
}
```

The `".user-list"` string is a CSS selector, and as you would expect, `.user-list` represents a class. When a tag is not specified, `div` is the default. So this view is equivalent to `<div class="user-list"></div>`.

Now, let's reference the list of users from the model we created earlier (`User.list`) to dynamically loop through data:

```javascript
// UserList.js

var UserList = {
	view: function(state) {
	  state.a = User.list.map(function(user) {
        return {
          _href: "#/edit/" + user.id,
          _text: user.firstName + " " + user.lastName
        }
      });
	}
}
```

Since `User.list` is a Javascript array, we can loop through the array using the `.map` method. This creates an array of nodes that represents a list of `div`s, each containing the name of a user.

The problem, of course, is that we never called the `User.loadList` function. Therefore, `User.list` is still an empty array, and thus this view would render a blank page. Since we want `User.loadList` to be called when we render this component, we can take advantage of component [lifecycle methods](https://github.com/magnumjs/mag.js#events):

```javascript
// UserList.js

var UserList = {
	controller: function(){
		User.loadList();
	},
	view: function(state) {
	  state.a = User.list.map(function(user) {
        return {
          _href: "#/edit/" + user.id,
          _text: user.firstName + " " + user.lastName
	    }
      });
	}
}
```

Notice that we added an `controller` method to the component, which references `User.loadList`. This means that when the component initializes, User.loadList will be called, triggering an XHR request. When the server returns a response, `User.list` gets populated.

---

Let's render the view from the entry point file `app.js` we created earlier:

```javascript
// app.js

var UserList = ..

mag.module(document.body, UserList)
```

The `mag.module` call renders the specified component (`UserList`) with a DOM element (`document.body`) as the template for the `state` elementMatchers. Opening the HTML file in a browser should now display a list of person names.

---

Right now, the list looks rather plain because we have not defined any styles.

There are many similar conventions and libraries that help organize application styles nowadays. Some, like [Bootstrap](http://getbootstrap.com/) dictate a specific set of HTML structures and semantically meaningful class names, which has the upside of providing low cognitive dissonance, but the downside of making customization more difficult. Others, like [Tachyons](http://tachyons.io/) provide a large number of self-describing, atomic class names at the cost of making the class names themselves non-semantic. "CSS-in-JS" is another type of CSS system that is growing in popularity, which basically consists of scoping CSS via transpilation tooling. CSS-in-JS libraries achieve maintainability by reducing the size of the problem space, but come at the cost of having high complexity.

Regardless of what CSS convention/library you choose, a good rule of thumb is to avoid the cascading aspect of CSS. To keep this tutorial simple, we'll just use plain CSS with overly explicit class names, so that the styles themselves provide the atomicity of Tachyons, and class name collisions are made unlikely through the verbosity of the class names. Plain CSS can be sufficient for low-complexity projects (e.g. 3 to 6 man-months of initial implementation time and few project phases).

To add styles, let's first create a file called `styles.css` and include it in the `index.html` file:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>My Application</title>
		<link href="styles.css" rel="stylesheet" />
	</head>
	<body>
		<script src="bin/app.js"></script>
	</body>
</html>
```

Now we can style the `UserList` component:

```css
.user-list {list-style:none;margin:0 0 10px;padding:0;}
.user-list-item {background:#fafafa;border:1px solid #ddd;color:#333;display:block;margin:0 0 1px;padding:8px 15px;text-decoration:none;}
.user-list-item:hover {text-decoration:underline;}
```

The CSS above is written using a convention of keeping all styles for a rule in a single line, in alphabetical order. This convention is designed to take maximum advantage of screen real estate, and makes it easier to scan the CSS selectors (since they are always on the left side) and their logical grouping, and it enforces predictable and uniform placement of CSS rules for each selector.

Obviously you can use whatever spacing/indentation convention you prefer. The example above is just an illustration of a not-so-widespread convention that has strong rationales behind it, but deviate from the more widespread cosmetic-oriented spacing conventions.

Reloading the browser window now should display some styled elements.

---

Let's add routing to our application.

Routing means binding a screen to a unique URL, to create the ability to go from one "page" to another. Mag.JS is designed for Single Page Applications, so these "pages" aren't necessarily different HTML files in the traditional sense of the word. Instead, routing in Single Page Applications retains the same HTML file throughout its lifetime, but changes the state of the application via Javascript. Client side routing has the benefit of avoiding flashes of blank screen between page transitions, and can reduce the amount of data being sent down from the server when used in conjunction with an web service oriented architecture (i.e. an application that downloads data as JSON instead of downloading pre-rendered chunks of verbose HTML).

We can add routing by changing the `mag.module` call to a `mag.route` call:

```javascript
// app.js

mag.route.addRoute('/list', function() {
	UserList();
})
```

The `mag.route` call specifies that the application will be rendered into `document.body`. The `"/list"` argument is the default route. That means the user will be redirected to that route if they land in a route that does not exist. The `{"/list": UserList}` object declares a map of existing routes, and what components each route resolves to.

Refreshing the page in the browser should now append `#!/list` to the URL to indicate that routing is working. Since that route render UserList, we should still see the list of people on screen as before.

The `#!` snippet is known as a hashbang, and it's a commonly used string for implementing client-side routing. It's possible to configure this string it via [`m.route.prefix`](route.md#mrouteprefix). Some configurations require supporting server-side changes, so we'll just continue using the hashbang for the rest of this tutorial.

---

Let's add another route to our application for editing users. First let's create a module called `UserForm.js`

```javascript
// UserForm.js

var UserForm = {
	view: function() {
		// TODO implement view
	}
}
```

Then we can `include` this new module from `app.js`

```javascript
// app.js

mag.route.addRoute('/list', function() {
	UserList();
})
```

And finally, we can create a route that references it:

```javascript
// app.js

mag.route.addRoute('/list', function() {
	UserList();
});
mag.route.addRoute('/edit/:id', function(id) {
	UserForm({id: id});
})
```

Notice that the new route has a `:id` in it. This is a route parameter; you can think of it as a wild card; the route `/edit/1` would resolve to `UserForm` with an `id` of `"1"`. `/edit/2` would also resolve to `UserForm`, but with an `id` of `"2"`. And so on.

Let's implement the `UserForm` component so that it can respond to those route parameters:

```javascript
// UserForm.js

var UserForm = {
	view: function(state, props) {
		
	}
}
```

And let's add some styles to `styles.css`:

```css
/* styles.css */
body,.input,.button {font:normal 16px Verdana;margin:0;}

.user-list {list-style:none;margin:0 0 10px;padding:0;}
.user-list-item {background:#fafafa;border:1px solid #ddd;color:#333;display:block;margin:0 0 1px;padding:8px 15px;text-decoration:none;}
.user-list-item:hover {text-decoration:underline;}

.label {display:block;margin:0 0 5px;}
.input {border:1px solid #ddd;border-radius:3px;box-sizing:border-box;display:block;margin:0 0 10px;padding:10px 15px;width:100%;}
.button {background:#eee;border:1px solid #ddd;border-radius:3px;color:#333;display:inline-block;margin:0 0 10px;padding:10px 15px;text-decoration:none;}
.button:hover {background:#e8e8e8;}
```

Right now, this component does nothing to respond to user events. Let's add some code to our `User` model in `src/models/User.js`. This is how the code is right now:

```javascript
// User.js
var User = {
	list: [],
	loadList: function() {
		return mag.request({
			method: "GET",
			url: "http://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},
}

```

Let's add code to allow us to load a single user

```javascript
// User.js

var User = {
	list: [],
	loadList: function() {
		return mag.request({
			method: "GET",
			url: "http://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},

	current: {},
	load: function(id) {
		return mag.request({
			method: "GET",
			url: "http://rem-rest-api.herokuapp.com/api/users/:id",
			data: {id: id},
			withCredentials: true,
		})
		.then(function(result) {
			User.current = result
		})
	}
}

```

Notice we added a `User.current` property, and a `User.load(id)` method which populates that property. We can now populate the `UserForm` view using this new method:

```javascript
// UserForm.js
var User = ..

var UserForm = {
	controller: function(props) {
		User.load(props.id)
	},
	view: function(state) {

	}
}
```

Similar to the `UserList` component, `controller` calls `User.load()`. Remember we had a route parameter called `:id` on the `"/edit/:id": UserForm` route? The route parameter becomes an attribute of the `UserForm` component's vnode, so routing to `/edit/1` would make `vnode.attrs.id` have a value of `"1"`.

Now, let's modify the `UserList` view so that we can navigate from there to a `UserForm`:

```javascript
// UserList.js
var User = ..

var UserList = {
	controller: function(){
		state.list = User.loadList();
	},
	view: function(state) {
	 if (state.list.data) {
      state.a = state.list.data.map(function(user) {
        return {
          _href: "#/edit/" + user.id,
          _text: user.firstName + " " + user.lastName
        }
      });
    }
	}
}
```

Here we changed `.user-list-item` to `a.user-list-item`. We added an `href` that references the route we want, and finally we added `oncreate: m.route.link`. This makes the link behave like a routed link (as opposed to merely behaving like a regular link). What this means is that clicking the link would change the part of URL that comes after the hashbang `#!` (thus changing the route without unloading the current HTML page)

If you refresh the page in the browser, you should now be able to click on a person and be taken to a form. You should also be able to press the back button in the browser to go back from the form to the list of people.

---

The form itself still doesn't save when you press "Save". Let's make this form work:

```javascript
// UserForm.js
var User = ...

var UserForm = {
	controller: function(props) {
      this.user = User.load(props.id)
	},
	view: function(state) {

	}
}
```

We added `oninput` events to both inputs, that set the `User.current.firstName` and `User.current.lastName` properties when a user types.

In addition, we declared that a `User.save` method should be called when the "Save" button is pressed. Let's implement that method:

```javascript
// User.js

var User = {
	list: [],
	loadList: function() {
		return mag.request({
			method: "GET",
			url: "http://rem-rest-api.herokuapp.com/api/users",
			withCredentials: true,
		})
		.then(function(result) {
			User.list = result.data
		})
	},

	current: {},
	load: function(id) {
		return mag.request({
			method: "GET",
			url: "http://rem-rest-api.herokuapp.com/api/users/:id",
			data: {id: id},
			withCredentials: true,
		})
		.then(function(result) {
			User.current = result
		})
	},

	save: function() {
		return mag.request({
			method: "PUT",
			url: "http://rem-rest-api.herokuapp.com/api/users/:id",
			data: User.current,
			withCredentials: true,
		})
	}
}

```

In the `save` method at the bottom, we used the `PUT` HTTP method to indicate that we are upserting data to the server.

Now try editing the name of a user in the application. Once you save a change, you should be able to see the change reflected in the list of users.

---

Currently, we're only able to navigate back to the user list via the browser back button. Ideally, we would like to have a menu - or more generically, a layout where we can put global UI elements

Let's create a file `Layout.js`:

```javascript
var Layout = function(comp) {
  return mag.create('layout', {
    view: function(state, props) {
      state.section = comp(props);
    }
  });
}
```

This component is fairly straightforward, it has a `<nav>` with a link to the list of users. Similar to what we did to the `/edit` links, this link activates routing behavior in the link.

Notice there's also a `<section>` element with `comp` as children. `node` is a reference to the node that represents an instance of the Layout component (i.e. the node returned by a `Layout` call). Therefore, `comp` refer to any children of that node.

Let's add some styles:

```css
/* styles.css */
body,.input,.button {font:normal 16px Verdana;margin:0;}

.layout {margin:10px auto;max-width:1000px;}
.menu {margin:0 0 30px;}

.user-list {list-style:none;margin:0 0 10px;padding:0;}
.user-list-item {background:#fafafa;border:1px solid #ddd;color:#333;display:block;margin:0 0 1px;padding:8px 15px;text-decoration:none;}
.user-list-item:hover {text-decoration:underline;}

.label {display:block;margin:0 0 5px;}
.input {border:1px solid #ddd;border-radius:3px;box-sizing:border-box;display:block;margin:0 0 10px;padding:10px 15px;width:100%;}
.button {background:#eee;border:1px solid #ddd;border-radius:3px;color:#333;display:inline-block;margin:0 0 10px;padding:10px 15px;text-decoration:none;}
.button:hover {background:#e8e8e8;}
```

Let's change the router in `app.js` to add our layout into the mix:

```javascript
// app.js

var UserList = ..
var UserForm = ..
var Layout = ..

//Routes: definitions and handlers
var LayoutList;
var LayoutUser;

mag.route.addRoute('/list', function() {
  var props = {
    key: 'list'
  };
  if (!LayoutList) {
    LayoutList = Layout(UserList(props));
  }
  LayoutList(props);
})

mag.route.addRoute('/edit/:id', function(id) {
  var props = {
    key: 'form'
  };
  if (!LayoutUser) {
    LayoutUser = Layout(UserForm(props));
  }
  props.id = id;
  LayoutUser(props);
})

mag.route.load('/list');
```

We replaced each component with a RouteResolver (basically, an object with a `handler` method). The `handler` methods can be written in the same way as regular functions would be.

The interesting thing to pay attention to is how components can be used instead of a selector string in a `state` call. Here, in the `/list` route, we have `Layout(UserList)`. This means there's a root node that represents an instance of `Layout`, which has a `UserList` node as its only child.

In the `/edit/:id` route, the argument that carries the route parameters into the `UserForm` component. So if the URL is `/edit/1`, then `props` in this case is `{id: 1}`, and this `UserForm(props)` is equivalent to `UserForm({id: 1})`.

Refresh the page in the browser and now you'll see the global navigation on every page in the app.

[Full working example](https://embed.plnkr.co/OVRbv4bH3GmGxvBRuZWd/)

---

This concludes the tutorial.

In this tutorial, we went through the process of creating a very simple application where we can list users from a server and edit them individually. As an extra exercise, try to implement user creation and deletion on your own.

If you want to see more examples of Mag.JS code, check the [examples](https://github.com/magnumjs/mag.js#examples) page. If you have questions, feel free to drop by with an [Issues](https://github.com/magnumjs/mag.js/issues).
