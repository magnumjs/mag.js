//Plugins:
var hookins = {
  values: [],
  attributes: [],
  elementMatcher: []
};

const callHook = function(hookins, key, name, i, data, before) {
  if (hookins[name][i].key == key) {
    before = {
      v: data.value,
      k: data.key
    };
    data.change = false;
    hookins[name][i].handler.call(hookins[name][i].context, data);
    //if any change
    if (
      before !==
      {
        v: data.value,
        k: data.key
      }
    ) {
      data.change = true;
    }
  }
};

const hookin = function(name, key, handler) {
  hookins[name].push({
    context: {},
    handler: handler,
    key: key
  });
};

const hook = function(name, key, data) {
  for (var i = 0, size = hookins[name].length; i < size; i++) {
    callHook(hookins, key, name, i, data);
  }
};

export {hookin};
export default hook;
