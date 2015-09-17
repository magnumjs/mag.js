###Composable components

##Basics for composing MagJS components

* A MagJS component is a fully functional self contained mag.module.

* It can be executed on any matching element id html template

###Component Example

A favorite or starred button on a unique article/item.

[Example](http://jsbin.com/fimovetova/edit?js,output)

```JavaScript
//Module Definition

var articleFavorite = {
  controller : function (props) {
    this.starred = props.articleData.starred ? props.starredClass : ''
  },
  view : function (state, props) {

    state.span = {
      _className = state.starred,

      _onclick = function () {
        props.onFavoritedArticle (!props.articleData.starred)
      }
     
    }
  }
}

//example/default props
var props = {
  onFavoritedArticle : articleDataService.handleDataChange,
  articleData : {
    id : 123,
    starred : false
  },
  starredClass : 'article-favorited'
}

// default template id
var templateId = 'star-article';

// Add instance to namespace package

mag.namespace('comps.articles.favorite') = mag.comp(templateId, articleFavorite, props)
```

**Basic HTML structure needed**

```html
<!-- favorite article component// can be added anywhere! Any other module/component can used it -->
<div id="star-article">
  <span></span>
</div>
```

Our component can now be used in all relative places to the article such as a list of article or in the detailed article view or even perhaps in a list of the user favorited articles etc...

###Component definition

Each should be the following;

* independent self contained
* all required external data comes via props
* maintains its own state
* events can be bubbled up via props handlers callbacks

###Best practices
 
See the existing mag.comps package namespace for example implementations
 
###Notes
