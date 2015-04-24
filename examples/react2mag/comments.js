/*
<div id="Comment" class="hide">
  <h2 class="commentAuthor">
        {this.props.author}
      </h2>
  <span />
</div>

<div id="CommentBox">
  <h1>Comments</h1>
  <div id="CommentList">
    <div class="commentList">
    </div>
  </div>
  <div id="CommentForm">
    <form class="commentForm">
      <input name="author" type="text" placeholder="Your name" />
      <input name="text" type="text" placeholder="Say something..." />
      <input type="submit" value="Post" />
    </form>
  </div>
</div>
*/

/** Mag.JS React 2 Mag : CommentBox **/

// https://facebook.github.io/react/docs/tutorial.html

var CommentBox = {
  controller: function(props) {

    this.loadCommentsFromStorage = function() {
      var data = localStorage.getItem(props.storageKey);
      if (!data) {
        data = JSON.stringify(props.data)
        localStorage.setItem(props.storageKey, data);
      }
      this.data = JSON.parse(data)
    }

    this.onload = function(node) {
      this.loadCommentsFromStorage();
    }.bind(this)

    this.handleCommentSubmit = function(comment) {
      var data = this.data,
        newData = data.concat([comment]);

      localStorage.setItem(props.storageKey, JSON.stringify(newData));
      this.data = newData
    }.bind(this)

  },
  view: function(state, props) {
    mag.module('CommentList', CommentList, {
      data: state.data
    })
    mag.module('CommentForm', CommentForm, {
      onCommentSubmit: state.handleCommentSubmit
    })
  }
}

var Comment = {
  view: function(state, props) {
    state.commentAuthor = props.author
    state.span = props.text
  }
}

var CommentList = {
  view: function(state, props) {

    var promises = props.data.map(function(comment) {
      return mag.module('Comment', Comment, {
        author: comment.author,
        text: comment.text
      }, 1)
    });

    Promise.all(promises).then(function(values) {
      state.commentList = values
    })

  }
}

var CommentForm = {
  controller: function(props) {
    this.author = mag.prop('')
    this.text = mag.prop('')

    this.handleSubmit = function(e) {
      e.preventDefault();
      
      var author = this.author()
      var text = this.text()
      if (!text || !author) {
        return;
      }
      
      props.onCommentSubmit({
        author: author,
        text: text
      })
      
      this.author('')
      this.text('')
      return
    }.bind(this)
  },
  view: function(state, props) {
    state.form = {
      _onchange: function(e) {
        state[e.target.name](e.target.value)
      }.bind(state),
      _onsubmit: state.handleSubmit
    }
  }
}

var props = {
  storageKey: 'data',
  data: [{
    "author": "Pete Hunt",
    "text": "This is one comment"
  }, {
    "author": "Michael Glazer",
    "text": "willLoad & didLoad lifecycle events needed"
  }]
}


mag.module("CommentBox", CommentBox, props)

/*
- CommentBox
  - CommentList
    - Comment
  - CommentForm
  */
  
//http://jsbin.com/torelucuni/edit
