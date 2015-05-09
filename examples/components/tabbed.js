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
  
var tabbed = {
  controller: function(p) {
    this.selected = p.selectedItem
  }
}

tabbed.view = function(s, p) {

  s.li = tabs({
    tabs: p.tabs,
    selectedItem: s.selected,
    onchange: p.changeTab
  })

  s.content = choosey(s.selected, p.tabs, p.params)

}

var tabs = function(data) {
  return data.tabs.map(function(item, i) {
    return tab(data, item, i)
  })
}

var tab = function(ctrl, item, idx) {
  return {
    // _key : idx, 
    a: {
      _class: ctrl.selectedItem == item.name ? "selected" : "",
      _onclick: ctrl.onchange.bind(ctrl, item.name),
      _text: item.name
    }
  }
}

var choosey = function(name, options, parms) {
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
