 var mod = {
   modules: [],
   controllers: [],
   elements: []
 }

 mod.submodule = function(module, args) {
   var controller = function(args) {
     return (module.controller || function() {}).apply(this, args)
   }.bind({}, args)

   var view = function(ctrl) {
     if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
     var template = module.view.apply(module, args ? [ctrl].concat(args) : [ctrl])
     if (args[0] && args[0].key != null) template.attrs.key = args[0].key
     return template
   }

   controller.$original = module.controller

   var output = {
     controller: controller,
     view: view
   }
   if (args[0] && args[0].key != null) output.attrs = {
     key: args[0].key
   }
   return output
 }

 mod.getArgs = function(i) {
   var args = mod.modules[i].controller && mod.modules[i].controller.$$args ? [mod.controllers[i]].concat(mod.modules[i].controller.$$args) : [mod.controllers[i]]
   return args
 }
