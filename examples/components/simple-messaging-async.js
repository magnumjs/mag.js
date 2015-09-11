// http://jsbin.com/rewitoyoki/edit?html,js,output

/*
.hide {
  display: none;
}
a {
  display: block;
}
a:after {
  content: " \bb";
}
#demo {
  margin: 10px;
  padding: 4px;
}
.simple-alert {
  height: 70px;
  padding: 20px;
  border: solid 1px #ebebeb;
  color: white;
  vertical-align: middle;
}
.simple-alert i {
  display: inline-block;
  font-style: normal;
  cursor: pointer;
}
.simple-alert i:before {
  content: '✖';
}
.simple-alert.default {
  background-color: blue;
}
.simple-alert.success {
  background-color: green;
}
.simple-alert.error {
  background-color: red;
}
*/


/*
<div id="Messaging">
  <h2>Messaging</h2>
  <button class="default">Show default message</button>
  <button class="success">Show success message</button>
  <button class="error">Show error message</button>
  <div id="messaging">
    <div class="messages">
    </div>
  </div>
  <div id="message">
    <div><i></i> <span></span>
    </div>
  </div>
</div>
  */
  
  
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

    // when the async module loading is completed add to state property
    mag.addons.sync.call(state, messages, 'messages');
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
