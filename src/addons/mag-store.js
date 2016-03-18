/*
Name: mag-store v0.1.1
Description: remote json api
Author: Michael Glazer
License: MIT
Homepage: https://github.com/magnumjs/mag.js
@requires mag.js & mag addons
(c) 2016
*/

mag.store = function(id, mod, props) {

  if (typeof id === 'object') {
    props = id;
  }

  props = props || {}
  options = props.store || {};

  var storageType = window[options.storageType || 'sessionStorage']
  var initialState = options.cache
  var expires = options.expires || 3000;
  var loop = options.loop || false;
  // http://jsonblob.com/api/jsonBlob/
  var res = 'https://api.myjson.com/bins/'
  var resource = options.resource || res; // jsonblod OR myjson
  var SOURCE_URL = options.url || options.collection && resource + options.collection || res + id;
  var listeners = [];
  var saving = false;

  if (loop) {
    setInterval(function() {
      if (!saving) {
        synchRemote()
          .then(function() {
            if (!saving) notify(getCache());
          })
      }
    }, expires);
  }

  var notify = function(state) {
    listeners.forEach(function(callback) {
      callback(state);
    });
  }

  var merge = function(local, remote) {
    //Loop remote:
    var ndata = []
    remote.forEach(function(ritem) {

      var lfound = local && local.find(function(litem) {
        return litem._id === ritem._id
      })
      if (lfound && lfound._time > ritem._time) {
        ndata.push(lfound)
      } else {
        ndata.push(ritem);
      }
    })
    return ndata;
  };

  var synchRemote = function() {
    var cacheCopy = getCache();
    return mag.request({
      url: SOURCE_URL
    }).then(function(rdata) {
      if (JSON.stringify(rdata) !== JSON.stringify(cacheCopy)) {
        // merge
        var ndata = merge(cacheCopy, rdata);
        setCache(ndata)
      }
      return ndata || rdata;
    });
  }


  var saveData = function(ndata) {

    var cacheCopy = getCache();
    // get remote latest
    return mag.request({
      url: SOURCE_URL
    }).then(function(rdata) {
      if (JSON.stringify(rdata) !== JSON.stringify(cacheCopy)) {
        // merge
        ndata = merge(ndata, rdata);
      }

      //Reset caches:
      setCache(ndata);

      return mag.request({
        url: SOURCE_URL,
        method: 'put',
        data: JSON.stringify(ndata),
        headers: [{
          "Content-Type": "application/json; charset=utf-8"
        }]
      }).then(function(data) {
        saving = false;
        return data;
      })
    });

  }


  var timer2;
  var getData = function() {
    var def = mag.deferred();

    clearTimeout(timer2);
    timer2 = setTimeout(function() {
      synchRemote()
        .then(function() {
          def.resolve(getCache())
        })
    });

    return def.promise;
  }

  //Privates :
  var cache;

  function setCache(data) {
    cache = data;
    storageType.setItem(SOURCE_URL, JSON.stringify(data))
    return mag.copy(data);
  }

  function getCache() {
    cache = JSON.parse(storageType.getItem(SOURCE_URL));
    return mag.copy(cache);
  }

  var findAll = function(query) {
    var data = getData();
    // get with no query
    if (!query) return data;

    //With query:
    // filter
    return data.then(function(rdata) {
      return rdata.filter(function(item) {
        var ret = false;
        for (var prop in query) {
          if (query[prop] === item[prop]) ret = true;
        }
        return ret;
      })
    })

  };

  var genId = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  var addNew = function(ndata) {
    var data = mag.copy(cache);

    // add id and time fields
    ndata._id = genId() + genId() + genId() + genId();
    ndata._time = Date.now();

    data.push(ndata);

    return save(data);
  }

  var deleteBy = function(query) {
    var data = getCache();

    var foundIndex = data.findIndex(function(item) {
      return item._id === query._id;
    });
    if (!~foundIndex) throw Error('mag.store - index not found');
    data.splice(foundIndex, 1);

    return save(data);
  };

  var update = function(query, change) {
    var data = getCache();

    var foundIndex = data.findIndex(function(item) {
      return item._id === query._id;
    });

    if (!~foundIndex) throw Error('mag.store - index not found');
    //Merge:
    for (var prop in data[foundIndex]) {
      if (typeof change[prop] !== 'undefined') data[foundIndex][prop] = change[prop];
    }
    data[foundIndex]._time = Date.now();

    return save(data);
  };

  var timer, delay = expires;
  var lastState;

  var check = function() {
    if (JSON.stringify(lastState) !== JSON.stringify(cache)) {
      // save to remote url
      saveData(lastState).then(function() {
        notify(getCache());
      })
    }
  }
  var save = function(data) {
    saving = true;
    // debounce changes -- check for diffs
    // then save to source url
    clearTimeout(timer);
    timer = setTimeout(function() {
      check();
    }, delay);

    return lastState = data;
  }

  var createNew = function(initialData) {
    saving = true;
    initialData = initialData || [];

    // POST to url
    // returns based on framework

    // myjson
    var getCreateId = function(responseData, responseHeaders) {
      //  {"uri":"https://api.myjson.com/bins/:id"}
      var id = responseData.uri.split('/').pop();
      return id;
    }

    return mag.request({
      url: SOURCE_URL,
      method: 'post',
      data: JSON.stringify(initialData),
      headers: [{
        "Content-Type": "application/json; charset=utf-8"
      }]
    }).then(function(data, headers) {
      saving = false;

      var newId = getCreateId(data, headers);

      return newId;
    })

  }

  var api = {
    subscribe: function(cb) {
      listeners.push(cb);
    },
    synch: synchRemote,
    create: createNew,
    clear: function() {
      // set collection to empty
      return saveData([]);
    },
    find: findAll,
    remove: deleteBy,
    update: update,
    insert: addNew,
    reset: function() {
      return setCache(null)
    }
  }

  if (id && mod) {
    var app;
    props[id] = api;

    if (typeof mod !== 'function') {
      app = mag.create(id, mod, props);
    } else {
      app = mod(id, props);
    }
    api.subscribe(function(state) {
      app(props).getState()[id] = state;
    });

    return app;
  } else {
    return api;
  }
}
