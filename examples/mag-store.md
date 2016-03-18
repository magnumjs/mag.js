#MagJS 'mag.store' remote storage Api

Connect to a remote JSON service such as myjson or JsonBlob

##Multiple invocation options

There are several ways in which to use mag.store within mag modules

###Called within a module (like within this example)

```javascript
props.todos = mag.store('4ky1b');

props.todos.subscribe(function(state) {
  console.log('state', state);
})

this.todos = props.todos.find();
```

###Called on a module definition
```javascript
var app = mag.store('todos', mod, props);
app();
```

###Called on a already created module mag.create

```javascript
var app = mag.create('todos', mod);
mag.store('todos', app, props);
```

###Called directly

```javascript
var storeApi = mag.store('1t5d7');
storeApi.subscribe(function(state){
  console.log('state', state);
})
storeApi.find({name:"test"}).then(function(data){
  console.log(data)
});
```
