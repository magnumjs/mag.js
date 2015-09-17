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

/****** UTILS EVENTS ******/

/*
mag.utils.events.publish('/page/load', {
	url: '/some/url/path' // any argument
});

var subscription = mag.utils.events.subscribe('/page/load', function(obj) {
	// Do something now that the event has occurred
});

// ...sometime later where I no longer want subscription...
subscription.remove();
*/

mag.utils.events = (function(){
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function(topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function(topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if(!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function(item) {
      		item(info || {});
      });
    }
  }
})();

/****** UTILS EVENT ******/


/****** UTILS COLLECTIONS ******/

mag.utils.collection = function (a) {
    var a = a || []
    return {
        getAll: function () {
            return a;
        },
        findAllByKeyVal: function (key, val) {
            return a.filter(function (obj) {
                // coerce both obj.id and id to type ? 
                return obj[key] == val;
            });
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

