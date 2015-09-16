###Composable components

##Basics for composing MagJS components

A MagJS component is a fully functional self contained mag.module.

It can be executed on any matching element id html template

###Component Example

A favorite or starred button on a unique article/item.


```JavaScript
//Module Definition

var articleFavorite = {
  controller : function (props) {
    this.starred = props.articleData.starred ? props.starredClass : ''

  },
  view : function (state, props) {

    state.button = {

     _className = state.starred,

     _onclick = function () {

      props.onFavoritedArticle (!props.articleData.starred)

     }
    }
  }
}

//example props
var props = {
  onFavoritedArticle : articleDataService.handleDataChange,
  articleData : {
    id : 123,
    starred : false
  },
  starredClass : 'article-favorited'
}
```

###Component definition

Each should be the following;

* independent self contained
* all required external data comes via props
* maintains its own state
* events can be bubbled up via props handlers callbacks

###Best practices

###Notes
