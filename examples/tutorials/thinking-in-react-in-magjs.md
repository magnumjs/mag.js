# Thinking in React in MagJS

MagJS is, in our opinion, the premier way to build big, fast template prototypes in JavaScript. 

One of the many great parts of MagJS is how it makes you think about apps as you build them. 
In this document, we'll walk you through the thought process of building a searchable product data table using MagJS.

## Start With A Mock

Imagine that we already have a JSON API and a mock from our designer. The mock looks like this:

<img width="228" alt="thinking-in-react-in-magjs-mock" src="https://user-images.githubusercontent.com/5196767/29177483-c62d3d56-7dbc-11e7-80a4-c9104646f462.png">

Our JSON API returns some data that looks like this:

```js
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Step 1: Break The UI Into A Component Hierarchy

The first thing you'll want to do is to draw boxes around every component (and subcomponent) in the mock and give them all names. 
If you're working with a designer, they may have already done this, so go talk to them! 
Their Photoshop layer names may end up being the names of your MagJS components!

But how do you know what should be its own component? 
Just use the same techniques for deciding if you should create a new function or object. 
One such technique is the single responsibility principle, that is, a component should ideally only do one thing. 
If it ends up growing, it should be decomposed into smaller subcomponents.

Since you're often displaying a JSON data model to a user, you'll find that if your model was built correctly, your UI (and therefore your component structure) will map nicely. 
That's because UI and data models tend to adhere to the same information architecture, which means the work of separating your UI into components is often trivial. 
Just break it up into components that represent exactly one piece of your data model.

<img width="275" alt="thinking-in-react-in-magjs-components" src="https://user-images.githubusercontent.com/5196767/29177815-b65b467e-7dbd-11e7-86da-53bede24aca9.png">

You'll see here that we have five components in our simple app. We've italicized the data each component represents.

1. FilterableProductTable (orange): contains the entirety of the example
2. SearchBar (blue): receives all user input
3. ProductTable (green): displays and filters the data collection based on user input
4. ProductCategoryRow (turquoise): displays a heading for each category
5. ProductRow (red): displays a row for each product

If you look at ProductTable, you'll see that the table header (containing the "Name" and "Price" labels) isn't its own component. This is a matter of preference, and there's an argument to be made either way. For this example, we left it as part of ProductTable because it is part of rendering the data collection which is ProductTable's responsibility. However, if this header grows to be complex (i.e. if we were to add affordances for sorting), it would certainly make sense to make this its own ProductTableHeader component.

Now that we've identified the components in our mock, let's arrange them into a hierarchy. This is easy. Components that appear within another component in the mock should appear as a child in the hierarchy:

- FilterableProductTable
  - SearchBar
  - ProductTable
    - ProductCategoryRow
    - ProductRow

## Step 2: Build A Static Version in MagJS

```html
<div id="FilterableProductTable">
  <SearchBar></SearchBar>
  <ProductTable></ProductTable>
</div>

<div id="SearchBar">
  <form>
    <input type="text" placeholder="Search..." />
    <label>
      <input type="checkbox" />
      <span class="checkable">Only show products in stock</span>
    </label>
  </form>
</div>

<div class="ProductRow">
  <div class="row">
    <div class="row-cell name">NAME</div>
    <div class="row-cell price">PRICE</div>
  </div>
</div>

<div class="ProductCategoryRow">
  <div class="row row-header">
    <category></category>
  </div>
</div>


<div class="ProductTable">
  <div class="row row-header">
    <div>Name</div>
    <div>Price</div>
  </div>
  <div class="row rows"></div>
</div>
```

```js
var  SearchBar = mag('SearchBar', {});

var  ProductTable = mag('ProductTable', ({products})=>{
  
  var lastCategory = null, rows=[];
    if (products) {

      products.forEach(function(product, i) {
        if (product.category !== lastCategory) {
          rows.push(ProductCategoryRow({
            category: product.category,
            key: product.category + i
          }));
        }
        rows.push(ProductRow({
          product: product,
          key: product.name
        }));
        lastCategory = product.category;
      });
    }
  
  return {rows};
 
});

var ProductCategoryRow  = mag('ProductCategoryRow', ({category})=>({category: category}))
var ProductRow  = mag('ProductRow', (props)=>{
 
      var name = props.product.stocked ?
      props.product.name : {
        _style: 'color: red',
        _text: props.product.name
      };

    var price = props.product.price;
  return {name, price};
})

var  FilterableProductTable = mag('FilterableProductTable',({products})=>({
  SearchBar: SearchBar(),
  ProductTable:  ProductTable({products: products})
}));


var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];
 

var container = mag('container', FilterableProductTable);

container({products: PRODUCTS});
```
[Try it on JSBin](http://jsbin.com/jihugusumo/edit?js,output)

Now that you have your component hierarchy, it's time to implement your app. 
The easiest way is to build a version that takes your data model and renders the UI but has no interactivity. 
It's best to decouple these processes because building a static version requires a lot of typing and no thinking, and adding interactivity requires a lot of thinking and not a lot of typing. We'll see why.

To build a static version of your app that renders your data model, you'll want to build components that reuse other components and pass data using props. props are a way of passing data from parent to child.
If you're familiar with the concept of state, don't use state at all to build this static version.
State is reserved only for interactivity, that is, data that changes over time. 
Since this is a static version of the app, you don't need it.

You can build top-down or bottom-up. 
That is, you can either start with building the components higher up in the hierarchy (i.e. starting with FilterableProductTable) or with the ones lower in it (ProductRow).
In simpler examples, it's usually easier to go top-down, and on larger projects, it's easier to go bottom-up and write tests as you build.
