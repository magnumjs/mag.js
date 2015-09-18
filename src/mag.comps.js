/*
Mag.JS Components v0.4
(c) Michael Glazer
https://github.com/magnumjs/mag.js
@Requires: mag.addons - magnumjs/mag.js/master/src/mag.addons.js
*/

var mag = mag || {}


mag.comps ={}

// wrapper function for mag.module
// var CommentsComponent = mag.comp("CommentBox", CommentBox, props);
// CommentsComponent()
mag.comp = function(id, module, props, clone){
  var instance,
   a =function(id2, props2, clone2){
     // using default templateId
    if(typeof id2!=='string'){
      clone2=props2
      props2=[].concat(id2)[0]
      id2=0
    }
    // merge props - not a deep merge ?
    //CASE: if no original defaults ?
    instance = mag.module(id2 || id, module, mag.addons.copy(mag.addons.merge(props2 || {}, props || {})), typeof clone2 !=='undefined'? clone2 : clone)
    return instance;
  }
  a.toJSON=function(){
    return instance ? instance() : ''
  }
  a.getState =function(){
    if(instance && instance.data && instance.data.type =='module'){
      var copyInstance = [].concat(mag.mod.getArgs(instance.data.id))
      var copyInstanceState = copyInstance[0];
      var copyInstanceProps = copyInstance[1];
      return copyInstanceState;
    }
  }
  a.toHTML=function(){
    return instance ? instance()._html() : ''
  }
  return a;
}

/*
<div id="passFail">
  <message/>
</div>
*/


/*
var passfail = function(p) {
  return mag.module('passFail', mag.comps.passFail, {
    pass: p.pass,
    fail: p.fail,
    message: {
      pass: 'yay!',
      fail: 'boo!'
    }
  }, 1)
}
*/

mag.comps.passFail = {}

mag.comps.passFail.view = function(state, props) {

  state.message = props.pass() ? props.message.pass : props.fail() ? props.message.fail : ""

  state._class = props.pass() ? 'success' : props.fail() ? 'error' : ''

 // state.messaging = state.message
}


/*
<div id="tabbed">
  <div class="tabs">
    <ul>
      <li>
        <a href="#"></a>
      </li>
    </ul>
  </div>
  <div class="content"></div>
</div>
*/
  
  
/*
var tabs = function(p){
  return mag.module('tabbed', tabbed, {
    "selectedItem": p.selectedItem,
    retain: true,
    "changeTab": p.changeTab,
    "params": {
      link: p.linkService,
      onLinkSubmit: p.handleLinkSubmit
    },
    "tabs": p.tabs
  })
}
*/
mag.comps.tabbed = {
  controller: function(p) {
    this.selected = p.selectedItem
  }
}

mag.comps.tabbed.view = function(s, p) {

  s.li = mag.comps.tabbed.tabs({
    tabs: p.tabs,
    selectedItem: s.selected,
    onchange: p.changeTab
  })

  s.content = mag.comps.tabbed.choosey(s.selected, p.tabs, p.params)

}

mag.comps.tabbed.tabs = function(data) {
  return data.tabs.map(function(item, i) {
    return mag.comps.tabbed.tab(data, item, i)
  })
}

mag.comps.tabbed.tab = function(ctrl, item, idx) {
  return {
    // _key : idx, 
    a: {
      _class: ctrl.selectedItem == item.name ? "selected" : "",
      _onclick: ctrl.onchange.bind(ctrl, item.name),
      _text: item.name
    }
  }
}

mag.comps.tabbed.choosey = function(name, options, parms) {
  var content
  options.forEach(function(item, idx) {
    if (item.name == name) {
      content = item.content
      return
    }
  })

  var comp = typeof content === 'function' ? content(parms) : content
  return comp
}



/*
// http://jsbin.com/tidomagisi/edit?html,css,js,output
<div id="messaging">
  <div class="messages">
  </div>
</div>
<div id="message">
  <div><i></i> <span></span>
  </div>
</div>

mag.module('messaging', mag.comps.messaging.Messaging, {
  message: 'All fields are required!',
  className: 'error'
})
    
*/


//specific attached comp namespace
mag.comps.messaging = {}

// Model collection
;(function(MessageModel) {

  MessageModel.messages = [];

  MessageModel.getMessages = function() {
    return MessageModel.messages;
  }
  MessageModel.addMessage = function(data) {
    MessageModel.getMessages().push(data)
  }
  MessageModel.removeMessage = function(index) {
    MessageModel.getMessages().splice(index, 1);
  }
  MessageModel.removeAllMessage=function(){
    MessageModel.getMessages().splice(0,MessageModel.getMessages().length);
  }
})(mag.comps.messaging.MessageModel = {});



// component list
mag.comps.messaging.Messaging = {
  messageClass: 'simple-alert', // over ride with props
  controller: function(props) {

    mag.comps.messaging.MessageModel.addMessage({
      message: props.message,
      className: props.className
    });

    // maintain state with our collection
    this.messageList = mag.comps.messaging.MessageModel.getMessages();

    // handler call back
    props.handleMessageRemove = function(index) {
      mag.comps.messaging.MessageModel.removeMessage(index);
    }
  },
  view: function(state, props, element) {
    // map our collection to a sub component's clone to array of promises
    // when the async module loading is completed add to state property
    state.messages = state.messageList.map(function(mess) {

      //cloning module template returns promise
      return mag.module("message", mag.comps.messaging.Message,
        // merge mess item with handle function
        mag.addons.merge({
          onMessageRemove: props.handleMessageRemove
        }, mess),
        // try = clone module template
        true);

    });

  }
};

// component item
mag.comps.messaging.Message = {
  view: function(state, props) {
    state.div = {
      i: {
        _onclick: function(Event, index, Element, objData) {
          // parent component property event handler
          props.onMessageRemove(objData.index);
        }
      },
      _class: props.className + ' ' + mag.comps.messaging.Messaging.messageClass,
    }
    state.span = props.message
  }
};


/*** MagJS - COMP - POPUP ***/
//@Example http://jsbin.com/xatazokexu/1/edit?html,js,output
/* 
// HTML template

   <div id="popup" class="overlay">
      <div class="popup">
        <h2 class="popup-header">
      </h2>
        <a class="close" href="#">&times;</a>
        <div class="popup-body">
        </div>
      </div>
    </div>
    
    
    //js init 
     mag.comps.popup({
        title: 'YO',
        content:'Hello'
    })
    
*/

;
(function(package) {

  var popup = {
    view: function(state, props) {
      state['popup-header'] = props.title
      state['popup-body'] = props.content
    }
  }
  package.popup = mag.comp('popup', popup)
})(mag.namespace('comps'))

/*** MagJS - COMP - POPUP ***/
