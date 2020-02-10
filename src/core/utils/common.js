var FUNCTION = 'function'
export const isObject =  value => {
  const type = typeof value;
  return value != null && (type == 'object' || type == FUNCTION)
}

export const isUndefined = data => typeof data == 'undefined'

export const isString = data => typeof data == 'string'

export const isFunction = data => typeof data == FUNCTION

export const copy = val => (isObject(val) ? Object.assign({}, val) : val)

export const clone = obj => {
  var temp = function temporary() {
    return obj.apply(obj, arguments);
  };
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = obj[key];
    }
  }
  return temp;
}


export const arrayAreEqual = (array1, array2) =>
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])

export const merge = function() {
    return Object.assign.apply({}, arguments);
}


export const extend = function(target, source, deep) {
    //if the sources are undefined then don't add to target even if exists
    for (var k in source) {
        if (isUndefined(source[k])) {
            delete source[k];
        } else if (deep && isObject(source[k])) {
            return extend(target[k], source[k]);
        }
    }
    return merge(target, source);
}


export const isHTMLEle = item => item && item.nodeType === 1;

const funReplacer = (key, value) =>
    isFunction(value) ? '' + value : value;

export const toJson = obj => JSON.stringify(obj, funReplacer);

export const isEmpty = obj => {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) return 0;
    }
    return 1;
}

export const isArray = obj =>
     Array.isArray(obj)
