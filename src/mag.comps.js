/*
Mag.JS Components v0.11
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/

mag.comps ={}

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

  state.messaging = state.message
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
