var shoes = {
  controller: function(props) {
    this.searchText = mag.prop(props.searchText)
    this.searching = this.searchText

    this.filter = function(item) {
      //console.log(item)
      return item.color.indexOf(this.searchText()) !== -1
    }.bind(this)

    this.shoes = props.shoes.filter(this.filter)
  },
  view: function(state, props) {
    state.shoes = props.shoes.filter(state.filter)
    mag.addons.binds(state, state.input = {})
    state.test = ''
    state.$a = {
      _onclick: function(e, index, node, data) {
        console.log(node.parentNode.__key, node.isChildOfArray, data)
      }
    }
  }
}

var props = {
  searchText: '',
  shoes: [{
    style: 'stilletos',
    color: 'red'
  }, {
    style: 'platform',
    color: 'gold'
  }, {
    style: 'flats',
    color: 'black'
  }]
}

mag.hookin('elementMatcher', 'test', function(data) {
  console.log('HOOKIN', data)
})


mag.module("shoes", shoes, props)


var SearchExample = {}

SearchExample.controller = function(props) {
  this.searchString = mag.prop(props.searchString)
  this.mapper = function(item) {
    return {
      _text: item.name,
      a: {
        _text: item.url,
        _href: item.url
      }
    }
  }
  this.li = props.libraries.map(this.mapper)
}

SearchExample.view = function(state, props) {
  state.input = {
    _value: state.searchString(),
    _oninput: function(e) {
      state.searchString(e.target.value)
      if (state.searchString().length > 0) {
        state.li = props.libraries.filter(function(l) {
          return l.name.toLowerCase().match(state.searchString().trim().toLowerCase());
        }).map(state.mapper);
      } else {
        state.li = props.libraries.map(state.mapper)
      }
    }
  }
}

var props = {
  searchString: '',
  libraries: [{
      name: 'Backbone.js',
      url: 'http://documentcloud.github.io/backbone/'
    }, {
      name: 'AngularJS',
      url: 'https://angularjs.org/'
    }, {
      name: 'jQuery',
      url: 'http://jquery.com/'
    }, {
      name: 'Prototype',
      url: 'http://www.prototypejs.org/'
    }, {
      name: 'React',
      url: 'http://facebook.github.io/react/'
    }, {
      name: 'Ember',
      url: 'http://emberjs.com/'
    }, {
      name: 'Knockout.js',
      url: 'http://knockoutjs.com/'
    }, {
      name: 'Dojo',
      url: 'http://dojotoolkit.org/'
    }, {
      name: 'Mootools',
      url: 'http://mootools.net/'
    }, {
      name: 'Underscore',
      url: 'http://documentcloud.github.io/underscore/'
    }, {
      name: 'Lodash',
      url: 'http://lodash.com/'
    }, {
      name: 'Moment',
      url: 'http://momentjs.com/'
    }, {
      name: 'Express',
      url: 'http://expressjs.com/'
    }, {
      name: 'Koa',
      url: 'http://koajs.com/'
    },

  ]
}


mag.module("SearchExample", SearchExample, props)

mag.module('filter-test', {
  controller: function(p) {
    this.term = mag.prop('')
    this.instock = mag.prop(false)

    this.search = function(value) {
      this.term(value.toLowerCase())
    }.bind(this)

    this.filter = function(item) {
      //if(this.term()=='' && ) return true

      if (this.term() != '' &&
        item.name.indexOf(this.term()) === -1 || (!item.stocked && this.instock())) {
        return false;
      }
      return true
      //       return this.term()!='' && item.name.toLowerCase().indexOf(this.term().toLowerCase()) > -1
    }.bind(this)

    this.products = function(filterText, inStockOnly) {
      var rows = []
      var lastCategory = null;

      p.products.forEach(function(product) {

        if (filterText &&
          product.name.indexOf(filterText) === -1 || (!product.stocked && inStockOnly)) {
          return;
        }

        if (product.category !== lastCategory) {

          // rows.push(product)
        }


        rows.push(product);
        lastCategory = product.category;
      });

      return rows
    }


  },
  view: function(s, p) {
    s.input = {
      _oninput: mag.withProp("value", s.search)
    }
    s.inStockOnly = {
      _onclick: function(e) {
        s.instock(e.target.checked)
      }
    }
    s.li = p.products.filter(s.filter)
  }
}, {
  products: [{
    category: 'Sporting Goods',
    price: '$49.99',
    stocked: true,
    name: 'Football'
  }, {
    category: 'Sporting Goods',
    price: '$9.99',
    stocked: true,
    name: 'Baseball'
  }, {
    category: 'Sporting Goods',
    price: '$29.99',
    stocked: false,
    name: 'Basketball'
  }, {
    category: 'Electronics',
    price: '$99.99',
    stocked: true,
    name: 'iPod Touch'
  }, {
    category: 'Electronics',
    price: '$399.99',
    stocked: false,
    name: 'iPhone 5'
  }, {
    category: 'Electronics',
    price: '$199.99',
    stocked: true,
    name: 'Nexus 7'
  }]
})


var ProductRow = {
  view: function(s, p, e) {
    var name = p.product.stocked ?
      p.product.name :
      p.product.name;

    s['row'] = p.product;
  }
};
var ProductCategoryRow = {
  view: function(s, p, e) {
    s['row-header'] = p.category;
  }
};
var ProductTable = {
  controller: function(p) {
    this.rows = []
  },
  view: function(s, p, e) {

    var lastCategory = null;
    var count = 0
    //s.tbody = s.rows
    var promises = []
    p.products.forEach(function(product) {

      if (product.category !== lastCategory) {

        var p = mag.module('ProductCategoryRow', ProductCategoryRow, {
          category: product.category
        }, 1);

        promises.push(p)

      }
      // var r = mag.module('ProductRow', ProductRow, {
      //  product: product
      //},1);
      // r.then(function(node) {
      //console.log(node.innerHTML) //Hello
      //})

      lastCategory = product.category;
      count++

    });

    Promise.all(promises).then(function(values) {

      s.tbody = values
    });
  }
};
var props = {
  products: [{
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football"
  }, {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball"
  }, {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball"
  }, {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch"
  }, {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5"
  }, {
    category: "Electronics",
    price: "$199.99",
    stocked: true,
    name: "Nexus 7"
  }]
};
mag.module('ProductTable', ProductTable, props)

var modal = {
  controller: function(props) {
    this.visible = mag.prop(props.visible)
  },
  view: function(state, props, element) {
    if (state.visible()) {
      element.classList.remove('hide')
      state.wrapper = {
        _html: props.content()
      }
    } else {
      element.classList.add('hide')
    }

    state.button = {
      _onclick: function() {
        state.visible(false)
      }
    }
  }
}

mag.module('modalCase', {
  view: function(state, props, element) {
    state.button = {
      _onclick: function() {
        mag.module('modal', modal, {
          visible: true,
          content: function() {
            return '<b>Hello Modal!</b>'
          }
        })
      }
    }
  }
})

mag.module("lister", {
  view: function(state, props, element) {
    var name1 = 'Yo!',
      name2 = 'Joe!'
    state.h2 = {
      _config: function(element, isNew, context) {
        console.log('CONFIG')
        context.onunload = function() {
          console.log('lister unload')
        }
        state.span = name1
        state.item = [1, 2, 3]
        mag.redraw()
      },
      _onclick: function() {
        state.item.reverse()
        state.span = state.span == name1 && name2 || name1
      }
    }
  }
})

mag.module("lister", {
  view: function(state, props, element) {
    var name1 = 'Yo!',
      name2 = 'Joe!'
    state.h2 = {
      _config: function(element, isNew, context) {
        if (isNew) {
          state.span = name1
          state.item = [1, 2, 3]
          mag.redraw()
        }
      },
      _onclick: function() {
        state.item.reverse()
        state.span = state.span == name1 && name2 || name1;
      }
    }
  }
})

mag.module('lister3', {
  controller: function(props) {
    this.item = [1, 2, 3]
    this.title = 'Lister'
  },
  view: function(state, props, element) {
    state.h2 = {
      _text: state.title,
      _onclick: function() {
        state.show = state.show ? !state.show : true
        state.item.reverse()
        state.title = 'Gister' + state.show
      }
    }
  }
})

mag.module("count", {
  view: function(state, props, element) {
    state.button = {
      _onclick: function() {
        state.count = state.count + 1 || 1
      }
    }
  }
})

mag.module('hello', {
  controller: function(props) {
    this.willunload = function(ele) {
      console.log('hello willunload', arguments)
    }
    this.didunload = function(ele) {
      console.log('hello didunload', arguments)
    }
    this.didload = function(ele) {
      console.log('hello didload', arguments)
    }
    this.willload = function(ele) {
      console.log('hello willload')
    }
    this.willupdate = function(ele) {
      console.log('hello willupdate')
    }
    this.didupdate = function(ele) {
      console.log('hello didupdate')
    }
    this.item = [{
      span: 'yo',
      _config: test
    }]

    function test(n, is, c, i) {
      console.log(is, i)
    }
    this.add = function() {
      //console.log(this.$done)
      this.item.push({
        span: 'test',
        _config: test
      })
      return false;
    }
  },
  view: function(state, props, element) {
    console.log('hello view')
    state.button = {
      _onclick: state.add.bind(state)
    }

    //state.h1 = '', 
    state.select = 2, state.textarea = 1
    //setTimeout(function() {
    //  console.log(state.h1, state.input)
    //}, 100)
  }
})

function merge(o1, o2) {
  for (var i in o2) {
    o1[i] = o2[i];
  }
  return o1;
}

mag.hookin('attributes', 'className', function(data) {
  data.value = data.node.classList + ' ' + data.value
  data.key = 'class'
})

mag.module("main", {
  controller: function() {
    this.h2 = {
      _text: 'Naver',
      _config: function(n, is, c, i) {
        c.count = c.count + 1 || 0
        c.onunload = function() {
          console.log('UNLOADED H2')
        }
      }
    }
  },
  view: function(s, p, n, con) {
    console.log(arguments)
    s.a = p.menuItem
    s.p = {
      _className: 'test',
      _config: function(n, is, c, i) {
        //console.log('here1',p)
        con.menuItem2 = []
      }
    }

    s.$a = {
      _onclick: function() {
        console.log('clicked', con)
        s.h2 = null
      },
      _config: function(n, is, c, i) {
        // console.log('here2')
      }
    }
  }
}, {
  menuItem: ['HOME', 'PROJECTS', 'SERVICES', 'CONTACT']
})
