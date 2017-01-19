/**
 * There are various use cases for hiding content on load
 * 1. on initial load to hide placeholder strings that will be interpolated
 * 2. large data set load that might change and or flicker the content when loaded
 * 3. async data loading, loading icon and reloading icon
 */

//Example: http://jsbin.com/kocodalaqu/edit?html,js,output 

//Example1 with large data set: http://jsbin.com/muxisecaxa/edit?html,js,output

//Example2: http://jsbin.com/ponowimeri/edit?html,js,output 

/* MagJS Example - mag.cloak */

mag.cloak = function(id, key) {

  var classHide = mag.cloak.classHideName || 'cloak';

  var cloak = function(node, index) {

    // should be already hidden at this point before code is run on page load class="cloak|hide"

    mag.utils.onLCEvent('willupdate', index, function(vnode) {
      //Check self
      if (vnode.classList.contains(classHide)) {
        vnode.classList.remove(classHide)
      }
      //class based for all sub nodes
      var nodes = vnode.getElementsByClassName(classHide);
      if (nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
          var item = nodes[i];
          item.classList.remove(classHide);
        }
      }
      //TODO: Remove handler only run once onload?
      //remove();
    }.bind(null, node));

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
