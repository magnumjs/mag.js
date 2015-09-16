/*
Mag.JS utils v0.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js
Testing: http://jsbin.com/zigavigegi/edit?js,console
*/

var mag = mag || {}


mag.utils ={}


/*
Common reusable minimal Interfaces you can implement
*/

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


/****** UTILS STORAGE ******/

mag.utils.localStorageJson = function() {

  return {
    getStore: function(storageKey) {
      var storedata = localStorage.getItem(storageKey);
      if (!storedata) {
        storedata = JSON.stringify(comments)
        localStorage.setItem(storageKey, storedata);
      }

    },
    addToStore: function(storageKey, plusData) {

      var data = this.getStore(storageKey)

      newData = data.concat([plusData]);

      localStorage.setItem(storageKey, JSON.stringify(newData))
      return newData
    }
  }
}
