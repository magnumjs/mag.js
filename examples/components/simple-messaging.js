// http://jsbin.com/jesivuxumi/edit?html,js,output

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
  <div id="demo">
    <h2>Messaging</h2>
    <button class="default">Show default message</button>
    <button class="success">Show success message</button>
    <button class="error">Show error message</button>
    <div id="messaging">
      <div class="message">
        <div><i></i> <span></span>
        </div>
      </div>
    </div>
  </div>
  */
  
  
  /** Mag.JS - simple messaging component **/

/** inspired by to :
http://callmenick.com/post/javascript-objects-building-javascript-component-part-1

Implemntation of original example
http://jsbin.com/cahudumaxe/edit?html,js,output

**/

var MessageModel = {}
MessageModel.messages = [];
MessageModel.addMessage = function(data) {
  MessageModel.messages.push(data)
}
MessageModel.removeMessage = function(index) {
  MessageModel.messages.splice(index, 1);
}

var Messaging = {
  messageClass: 'simple-alert', // over ride with props
  controller: function(props) {
    MessageModel.addMessage({
      message: props.message,
      className: props.className
    });

    // merge props for over rides
//         mag.addons.merge(props, Messaging)

    // allow view to be updated on changes
    this.messages = MessageModel.messages;

    this.$i = {
      _onclick: function(Event, index, Element, objData) {
        MessageModel.removeMessage(objData.index);
      }
    }

  },
  view: function(state, props, element) {

    state.message = state.messages.map(function(mess) {
      return {
        div: {
          //           _className : mess.className+' '+Messaging.messageClass,
          _config: function(node) {
            // remove all classes
            node.className = '';
            node.classList.add(mess.className, Messaging.messageClass)
          }
        },
        span: mess.message,
      };
    });
  }
};

var demo = {}

demo.controller = function(props) {

}

demo.view = function(state, props) {

  state.$button = {
    _onclick: function() {
      var message = this.className;
      mag.module('messaging', Messaging, {
        //messageClass: 'tester', // over ride default class
        message: message,
        className: message
      })
    }
  }

}

var props = {

}


mag.module("demo", demo, props)
