// data model - uniform access principle


// model & service
var CommentService = function(data) {
  data = data || {}
  this.author = data.author
  this.text = data.text
}

CommentService.comments = [];

CommentService.list = function(comments) {
  //local storage implementation

  var Deferred = mag.deferred()

  setTimeout(function() {

    if (comments) {
      CommentService.comments = comments;
    }
    Deferred.resolve(CommentService.comments)
  }, 1000)

  return Deferred.promise;
}
CommentService.save = function(comment) {

  var Deferred = mag.deferred()

  setTimeout(function() {

    CommentService.list().then(function(data) {
      CommentService.comments = data.concat([comment]);

      Deferred.resolve(CommentService.comments)
    }, 500)
  })

  return Deferred.promise;
}

var CommentBox = {}

CommentBox.controller = function(props) {

  var commentService = new props.CommentService(props)

  // load default or initial comments from service - sync with state

  this.data = props.CommentService.list(props.data);

}



CommentBox.view = function(state, props) {

  mag.module('CommentList', CommentList, {
    data: Array.isArray(state.data) ? state.data : [],
    CommentService: props.CommentService,
  })

}

var CommentList = {
  view: function(state, props) {

    state.comment = props.data.map(function(comment) {
      // clone component returns a promise instance
      return mag.module('Comment', Comment, new props.CommentService(comment), true)
    })

  }
}

var Comment = {
  view: function(state, props) {
    state.commentAuthor = props.author
    state.span = props.text
  }
}

var props = {
  CommentService: CommentService,
  data: [{
    "author": "Pete Hunt",
    "text": "This is one comment"
  }, {
    "author": "Michael Glazer",
    "text": "willLoad & didLoad lifecycle events needed"
  }]
}

mag.module("CommentBox", CommentBox, props)

/** Mag.JS - simple messaging component **/

/** inspired by the following **/

//http://callmenick.com/post/javascript-objects-building-javascript-component-part-1
//http://jsbin.com/cahudumaxe/edit?html,js,output

// Model collection
var MessageModel = {}
MessageModel.messages = [];
MessageModel.getMessages = function() {
  return MessageModel.messages;
}
MessageModel.addMessage = function(data) {
  MessageModel.messages.push(data)
}
MessageModel.removeMessage = function(index) {
  MessageModel.messages.splice(index, 1);
}

// component list
var Messaging = {
  messageClass: 'simple-alert', // over ride with props
  controller: function(props) {

    MessageModel.addMessage({
      message: props.message,
      className: props.className
    });

    this.messages = [];
    // maintain state with our collection
    this.messageList = MessageModel.getMessages();

    // handler call back
    props.handleMessageRemove = function(index) {
      MessageModel.removeMessage(index);
    }
  },
  view: function(state, props, element) {
    // map our collection to a sub component's clone to array of promises
    var messages = state.messageList.map(function(mess) {

      //cloning module template returns promise
      return mag.module("message", Message,
        // merge mess item with handle function
        mag.addons.merge({
          onMessageRemove: props.handleMessageRemove
        }, mess),
        // try = clone module template
        true);

    });

    state.messages = messages;

    // when the async module loading is completed add to state property
    // mag.addons.sync.call(state, messages, 'messages');
  }
};

// component item
var Message = {
  view: function(state, props) {
    state.div = {
      i: {
        _onclick: function(Event, index, Element, objData) {
          // parent component property event handler
          props.onMessageRemove(objData.index);
        }
      },
      _class: props.className + ' ' + Messaging.messageClass,
    }
    state.span = props.message
  }
};

// component container
mag.module("Messaging", {
  view: function(state, props) {
    // greedy selector '$' all buttons
    state.$button = {
      _onclick: function() {
        var message = this.className;
        // initialize component with properties
        mag.module('messaging', Messaging, {
          message: message,
          className: message
        })
      }
    }
  }
});





// descriptive todos example - no shortcuts
var todos = {}

todos.controller = function(props) {

  this.todoItem = mag.prop([])

  this.add = function(text) {
    var item = {
      text: text,
      _completed: false,
      _onclick: function(e) {
        var index = [].indexOf.call(document.querySelectorAll('.todoItem'), e.target.parentNode)
        this.todoItem()[index]._completed = !this.todoItem()[index]._completed
      }.bind(this),
      _config: function(node, isNew, context, index) {
        //console.log(isNew, index)
        context.onunload = function() {
            console.log('unloaded')
          }
          //node.querySelector('input').checked = node.getAttribute('completed') == 'true' ? true : false
      }
    }
    this.todoItem().push(item)
  }.bind(this)

  this.remains = function() {
    return this.todoItem().filter(function(item) {
      return item._completed == false
    }).length
  }.bind(this)

  this.archive = function() {
    this.todoItem(this.todoItem().filter(function(item, index) {
      if (!item._completed) {
        return item
      }
    }))
    console.log('test', this.todoItem().length)
    return false
  }.bind(this)
}

todos.view = function(state, props, element) {

  var todo = mag.prop(''),
    doAdd = function(e) {
      if (todo() == '') return
      state.add(todo())
      e.target.value = todo('')
    }

  state.remaining = state.remains()
  state.size = state.todoItem().length + ' remaining'

  state.total = {
    a: {
      _onclick: state.archive
    },
    _class: "total " + (state.todoItem().length > 0 ? 'show' : 'hide'),
  }

  if (state.remains() == 0 && state.todoItem().length > 0) {
    state.total._text = 'Done!'
    state.remaining = {
      _class: "remaining hide"
    }
    state.size = '';

  } else {
    state.remaining = {
      _class: "remaining",
      _text: state.remains() + ' of '
    }
    state.total._text = ''
  }

  state.input = {
    _onfocus: function() {
      this.value = ''
    },
    _value: todo(),
    _onchange: mag.withProp('value', todo),
    _onkeyup: function(e) {
      if (e.which == 13) {
        doAdd(e)
      }
    }
  }

  state.button = {
    _onclick: doAdd
  }
}

mag.module("todos", todos)

// simple nested/reuse module examples

var passFail = {}

passFail.view = function(state, props, element) {

  state.message = props.pass() ? props.message.pass : props.fail() ? props.message.fail : ""

  state._class = props.pass() ? 'success' : props.fail() ? 'error' : ''

  state.messaging = state.message
}

var build = {}
build.view = function(state, props, element) {
  var link = function() {
    var scripts = document.querySelectorAll('head script')
    var string = ''
    for (var k in scripts) {
      var url = scripts[k].src
      if (!url) continue

      string += 'file=' + url + '&'
    }
    return 'http://reducisaurus.appspot.com/js?' + string
  }()

  state.a = {
    _target: 'blank',
    _href: link
  }
}

var app = {}

app.controller = function(props) {

  this.show = mag.prop(true)
  this.name = '?'
  this.didload = utils.onload
  this.pass = mag.prop("")
  this.fail = mag.prop("")

  this.change = function() {
    console.log('clicked')
    this.show() ? this.pass(true) : this.fail(true) && this.pass('')
    this.show(!this.show())
  }.bind(this)
}

app.view = function(state, props, element) {
  state.test = {
    _class: 'test ' + (state.show() ? 'show' : 'hide'),
    _html: 'Hello'
  }

  state.b = mag.module('build', build)

  state.message = mag.module('passFail2', passFail, {
    pass: state.pass,
    fail: state.fail,
    message: {
      pass: "yay!",
      fail: "boo!"
    }
  })

  state.button = {
    _onclick: state.change
  }
  setTimeout(function() {
    state.name = 'world'
  }, 1000)
}

var utils = {}
utils.onload = function(e, element) {
  element.classList.remove("hide")
}

mag.module("test", app, {
  prop: true
})
