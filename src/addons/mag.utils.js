/*
Mag.JS utils v0.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js
Testing: http://jsbin.com/zigavigegi/edit?js,console
*/

var mag = mag || {}


mag.utils ={}

/****** UTILS COLLECTIONS ******/

mag.utils.collection = function() {
  var a = []
  return {
    getAll: function() {
      return a;
    },
    addOne: function(item) {
      a.push(item)
    },
    removeOne: function(index) {
      a.splice(index, 1)
    }
  }
}


/*
var a =  mag.utils.collection()

console.log(a.getAll(), a.addOne({me:true}))

var b = mag.utils.collection()
b.addOne({me1:false})

console.log(b.getAll(),b.addOne({me2:false}), a === b, a.getAll())

 b.removeOne(0)

console.log(b.getAll())
*/

/****** UTILS COLLECTIONS ******/
