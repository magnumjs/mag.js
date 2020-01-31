function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

const copy = val => (isObject(val) ? Object.assign({}, val) : val);

const clone = function(obj) {
  var temp = function temporary() {
    return obj.apply(obj, arguments);
  };
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = obj[key];
    }
  }
  return temp;
};

export {isObject, copy, clone};
