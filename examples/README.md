##Implementation Examples

## Implement automatic 2 way bindings

[Binding Example](http://jsbin.com/dicezageja/edit)

[Component Hierarchy 3 deep](http://jsbin.com/fosoladene/edit?html,js,output)

[Simple form with passFail component](http://jsbin.com/laraserije/edit?html,js,output)

###Notes

This works by Mag.js listening to changes to state
If and only if the state has changed will it rerun the view
On view load it is simply re running the bind method which then sets the defaults it has listed.

If would be nicer if it can be set in the controller
If it listened to any change and set it directly to that change
