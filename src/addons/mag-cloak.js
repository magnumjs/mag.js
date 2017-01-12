//Example: http://jsbin.com/yepaqewucu/edit?html,js,output 

/* MagJS Example - mag.cloak */

mag.cloak = function(id, key) {

  var cloak = function(node, index) {

    node.style.display = 'none';
    
    mag.utils.onLCEvent('didupdate', index, function(vnode) {
      vnode.style.display = 'block'
    }.bind({}, node));

  };

  var cloaker = function(id) {
    var node = id;
    if (id instanceof HTMLElement) {
      var id = id.id;
    } else {
      //get instances node
      node = mag.getNode(id);
    }

    if (node) {
      var index = mag.utils.items.getItem(id);

      if (~index) {
        cloak(node, index);
      }
    }
  };

  if (id) {
    // only one
    cloaker(id)
  } else {
    // loop through all mag module instances
    mag.utils.items.i.forEach(function(val, index) {
      //get templateID
      var node = mag.getNode(val);
      cloak(node, index);
    });
  }
}

