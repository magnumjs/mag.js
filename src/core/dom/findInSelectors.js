const KEY = 'KEY'

const selectors = ['#' + KEY, '.' + KEY, KEY];
const findInSelectors = function(node, key) {
    var found;
    //methods to search
    for (var k in selectors) {
        var search = selectors[k].replace(KEY, key);
        found = node.querySelector(search);
        if (found) break;
    }
    return found;
}

export default findInSelectors