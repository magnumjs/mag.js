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

mag.utils.collection = function (a) {
    var a = a || []
    return {
        getAll: function () {
            return a;
        },
        findByKeyVal: function (key, val) {
            return a.filter(function (obj) {
                // coerce both obj.id and id to type ? 
                return obj[key] == val;
            })[0];
        },
        addOne: function (item) {
            a.push(item)
        },
        removeOne: function (index) {
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
    getStore: function(storageKey, defaultData) {
      
      var storedata = localStorage.getItem(storageKey);
      if (!storedata) {
        storedata = JSON.stringify(defaultData)
        localStorage.setItem(storageKey, storedata);
      }
     return storedata;
     
    },
    setStore: function(storageKey, plusData) {

      var data = this.getStore(storageKey)

      newData = data.concat([plusData]);

      localStorage.setItem(storageKey, JSON.stringify(newData))
      
      return newData;
    }
  }
}


//local storage JSON promises implementation
mag.utils.localStorageJsonP = function() {

  return {
    getStore: function(storageKey, defaultData, cb) {

      var Deferred = mag.deferred()

      setTimeout(function() {
        var storedata = localStorage.getItem(storageKey);
 
        if (!storedata) {
          storedata = JSON.stringify(defaultData)
          localStorage.setItem(storageKey, storedata);
        }
        Deferred.resolve(JSON.parse(storedata))
      })

      return Deferred.promise.then(cb)
    },
    setStore: function(storageKey, plusData, cb) {

      var Deferred = mag.deferred()

      setTimeout(function() {

        this.getStore(storageKey).then(function(data) {
          
          var newData = data.concat([plusData]);

          localStorage.setItem(storageKey, JSON.stringify(newData))

          Deferred.resolve(newData)
        })
      })

      return Deferred.promise.then(cb)
    }
  }
}

/****** UTILS STORAGE ******/

