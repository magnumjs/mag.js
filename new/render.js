var render = {
  roots: [],
  templates: {}
}

render.redraw = function(module) {
  for (var i = 0, root; root = render.roots[i]; i++) {
    if (module.controllers[i]) {

      var elementClone = module.elements[i]
      var args = module.getArgs(i)
      module.modules[i].view(elementClone, module.controllers[i], args)

      setwatch(args, function(elementClone, i, propName, action, diff, oldVal) {
        var args = module.getArgs(i)
        render.interpolate(elementClone, args[0])
      }.bind(null, elementClone, i))

      render.interpolate(elementClone, args[0])
    }
  }
}

render.isTypeOf = function(type, thing) {
  if (this.toString.call(thing) === '[object ' + type + ']') {
    return true
  }
}
render.types = ['Array', 'String', 'Object', 'Function']

render.interpolate = function(elementClone, args) {
  for (var prop in args) {

    if (render.isTypeOf('Array', args[prop])) {
      // loop

      // get element to clone
      var eles = domElement.findByKey(elementClone, prop)
      if (eles.length < 1) continue;

      var template
      var myNode = eles[0].item(elementClone).parentNode

      if (!render.templates[prop]) {
        template = eles[0].item(elementClone).cloneNode(true)
        //save template
      } else {
        // remove all existing node
        // do a diff?

        while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild)
        }
        template = render.templates[prop]
      }

      for (var i = 0; i < args[prop].length; i++) {

        var newest = template.cloneNode(true);
        var val = args[prop][i];

        // simple list no sub objects or functions

        domElement.setTextContent(newest, val)

        myNode.appendChild(newest)
      }
      if (!render.templates[prop]) {
        render.templates[prop] = template

        myNode.removeChild(eles[0].item(elementClone))
      }
    } else if (render.isTypeOf('Function', args[prop])) {
      if (args[prop]._type == 'vdom') {

        domElement.event(elementClone, prop, args[prop])
        domElement.setAttrs(elementClone, prop, args[prop]().attrs)
      } else {
        //console.log(prop, args[prop]())
      }
    } else if (render.isTypeOf('String', args[prop])) {
      domElement.val(elementClone, prop, args[prop])

    } else if (render.isTypeOf('Object', args[prop])) {
      // set all key vals
      for (var k in args[prop]) {
        domElement.replaceWithin(elementClone, k, args[prop][k])
      }
    }
  }
}
