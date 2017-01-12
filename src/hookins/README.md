##MagJS Hookins!

Examples of simple and powerful hookins to the MagJS library

Some core examples exists in the addons such as 'style' and 'className'.

These hookins are for:

- attributes
- values

Simple Api
```javascript

//Hookin for attributes matching on '_bind'
mag.hookin('attributes', 'bind', function(data) {

  //the node
  data.node;
  // the selector key
  data.key;
  //the selector value
  data.value;
  
  
});
```


###Examples

* [Bind Attribute](https://github.com/magnumjs/mag.js/blob/master/src/hookins/mag.bind.js)
