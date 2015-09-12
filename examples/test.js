mag.module("mathdemo", {
  controller: function() {

    this.num1 = mag.prop(2);
    this.num2 = mag.prop(2);

  },

  view: function(state) {

    state.button = {
      _onclick: function() {
        state.result = parseInt(state.num1()) + parseInt(state.num2());

        state.num1(0);
      }
    };

    mag.addons.change(state, state.form = {});

  }
});


mag.module("mathdemo1", {
  controller: function() {
    this.num1 = 1;
    this.num2 = 2;
  },
  view: function(state, props) {
    state.button = {
      _onclick: function() {
        if (!state.num1 || !state.num2) {
          state.result = 'All fields must be filled';
        } else {
          state.result = parseInt(state.num1) + parseInt(state.num2);

          state.num1 = 10;

          console.log(state.num1)
        }
      }
    };
  }
});

mag.module("mathdemo2", {
  controller: function() {
    this.numbers = {
      num1: 1,
      num2: 2
    }
  },
  view: function(state, props) {

    state.button = {
      _onclick: function() {
        if (!state.numbers.num1 || !state.numbers.num2) {
          state.result = 'All fields must be filled';
        } else {
          state.result = parseInt(state.numbers.num1) + parseInt(state.numbers.num2);
        }
      }
    };

  }
});


var mathdemo3 = {};

mathdemo3.view = function(state, props) {

  state.$input = {
    _config: function() {
      mag.addons.merge(props, state);
    },
    _oninput: function(event, index, node, container) {

      var res = parseInt(state.numbers[container.index].num1) + parseInt(state.numbers[container.index].num2);

      state.numbers[container.index].result = res;

    }
  };

};

var props = {
  numbers: [{
    num1: 2,
    num2: 2
  }, {
    num1: 3,
    num2: 1
  }]
};

mag.module("mathdemo3", mathdemo3, props);



var mathdemo4 = {};

mathdemo4.controller = function(props) {
  mag.addons.merge(props, this);
}
mathdemo4.view = function(state, props) {

  state.$input = {
    _oninput: function(event, index, node, container) {

      console.log(state.numbers[container.index].nested[0].test)

      var res = parseInt(state.numbers[container.index].num1) + parseInt(state.numbers[container.index].num2);

      state.numbers[container.index].result = res;

    }
  };

};

var props = {
  numbers: [{
    num1: 2,
    num2: 2,
    nested: [{
      test: '',
      option: ['momma', 'said', 'yo']
    }]
  }, {
    num1: 3,
    num2: 1,
    nested: [{
      test: '',
      option: ['momma1', 'said2', 'yo3']
    }]
  }]
};

mag.module("mathdemo4", mathdemo4, props);


function myfun(comments) {
  var Deferred = mag.deferred()

  setTimeout(function() {

    Deferred.resolve('tester')
  })

  return Deferred.promise;
}

mag.module("mathdemo5", {
  controller: function() {

    this.willload = function() {

      myfun().then(function() {
        this.data = 'test'
      }.bind(this))


    }.bind(this)
  },
  view: function(state, props) {

    var res = mag.module('mathdemo6', {
      controller: function() {
        console.log('init')
        this.author = '';
      },
      view: function(state) {
        state.add = {
          _onclick: function(e) {
            e.preventDefault();
            console.log(state.author);
            return false;
          }
        }
      }
    }, {})

    state.result = res;
  }
});


var demo = {}

demo.controller = function(p) {
  p.data = [{
    name: 'joe'
  }, {
    name: 'bob'
  }]
}

demo.view = function(s, p) {

  s.h2 = {
    _onclick: function() {
      s.count = s.count + 1 || 1
      p.data.push({
        name: "--" + s.count
      })
    }
  }

  mag.module('CommentList', CommentList1, {
    data: p.data
  })

}

var CommentList1 = {
  view: function(s, p) {
    //console.log('view', p.data.length)

    var promises = p.data.map(function(comment) {
      //console.log('name: ', comment.name)
      return mag.module('Comment', Comment1, {
        name: comment.name
      }, 1)


    })


    Promise.all(promises).then(function(d) {
      // console.log(d, d.length)
      s.commentList = d
    })


  }
}

var Comment1 = {
  view: function(s, p) {
    s.span = p.name
  }
}

var props = {

}

mag.module("demo", demo, props)

mag.module('unloader', {
  controller: function() {
    this.count = 1
    this.thing = mag.prop('test')
  },
  view: function(state) {
    state.button = {
      _onclick: function() {
        console.log(state.count)
        state.thing('other')
        state.count = state.count + 1
      },
      _className: 'metoo'
    }
    state.mod = state.count % 2 ? mag.module('testmod', {
      controller: function() {
        console.log('inner ctrl')
        show(this)
        this.onunload = function() {
            console.log('removed from state')
          },
          this.onreload = function() {
            console.log('reloaded into state')
          }
      },
      view: function(s) {
        console.log('viewee')
        s.dude = 1
      }
    }, {}, 1) : {
      _html: 'other'
    }
  }
})

var tabbed = {
  controller: function(p) {
    console.log(p)
    this.selected = p.selectedItem
    this.changeTab = function(name) {
      this.selected = name
      return console.log(name, p.selectedItem, this.selected)
    }.bind(this)

  }
}

tabbed.view = function(s, p) {

  s.li = tabs({
    tabs: p.tabs,
    selectedItem: s.selected,
    onchange: s.changeTab
  })

  s.content = choosey(s.selected, p.tabs)

}

var tabs = function(data) {
  return data.tabs.map(function(item, i) {
    return tab(data, item, i)
  })
}

var tab = function(ctrl, item, idx) {
  return {
    // _key : idx, 
    a: {
      _class: ctrl.selectedItem == item.name ? "selected" : "",
      _onclick: ctrl.onchange.bind(ctrl, item.name),
      _text: item.name
    }
  }
}

var choosey = function(name, options) {
  var content
  options.forEach(function(item, idx) {
    if (item.name == name) {
      content = item.content
      return
    }
  })

  var comp = typeof content === 'function' ? content() : content
    //console.log('TEST', comp)
  return comp
}

var form = function() {
  return {
    _html: 'FORM STUFF'
  }
}
var list = function() {
  return {
    _html: 'LIST STUFF'
  }
}

mag.module('tabbed', tabbed, {
  "selectedItem": "form",
  "tabs": [{
    "name": "form",
    "content": form
  }, {
    "name": "list",
    "content": list
  }]
})



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

var shoes = {
  controller: function(props) {
    this.searchText = mag.prop(props.searchText)
    this.searching = this.searchText
    mag.addons.copy(props.shoes, this.shoes = [])

    this.clickee = function(e, index, node, data) {
      return console.log(e, index, node, data)
    }

    this.filter = function(item) {
      return item && item.color.indexOf(this.searchText()) !== -1
    }.bind(this)

    this.shoes = this.shoes.filter(this.filter)
  },
  view: function(state, props) {
    state.shoes = props.shoes.filter(state.filter)
    mag.addons.change(state, state.input = {})
    state.test = ''
    state.$a = {
      _onclick: state.clickee
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
  // console.log('HOOKIN', data)
})

mag.module("shoes", shoes, props)


var modal = {
  controller: function(props) {
    console.log('ctrl')
    this.visible = mag.prop(props.visible)
  },
  view: function(state, props, element) {
    console.log('view', state.visible())
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
          console.log('UNLOADED H2', arguments)
        }
      }
    }
  },
  view: function(s, p, n) {
    console.log(arguments)
    s.a = p.menuItem
    s.p = {
      _className: 'test',
      _config: function(n, is, c, i) {
        //console.log('here1',p)
        //con.menuItem2 = []
      }
    }

    s.$a = {
      _onclick: function() {
        console.log('clicked')
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


mag.module('hello', {
  controller: function(props) {
    this.onunload = function(e, ele) {
      console.log('hello onunload', arguments)
    }
    this.didload = function(e, ele) {
      console.log('hello didload', arguments)
    }
    this.willload = function(e, ele) {
      console.log('hello willload')
        //e.preventDefault()
    }
    this.willupdate = function(e, ele) {
      console.log('hello willupdate')
    }
    this.didupdate = function(e, ele) {
      console.log('hello didupdate')
    }
    this.item = [{
      span: 'yo',
      _config: test
    }]

    function test(n, is, c, i) {
      //console.log(is, i)
    }
    this.add = function() {
      //console.log(this.$done)
      this.item.push({
          span: 'test',
          _config: test
        })
        //mag.redraw()
      return false;
    }
  },
  view: function(state, props, element) {
    console.log('hello view')

    state.button = {
      _config: function(n, is, c, i) {
        c.onunload = function() {
          console.log('mod config onunloader!')
        }
      },
      _onclick: state.add.bind(state)
    }

    mag.module('innerhello', {
      controller: function() {
        this.onunload = function(e, ele) {
          console.log('hello inner onunload', arguments)
        }
        this.willload = function(e, ele) {
          console.log('hello inner willload')
            //e.preventDefault()
        }
      },
      view: function(s) {
        console.log('hello inner view')
        s.b = {
          _config: function(n, is, c, i) {
            c.onunload = function() {
              console.log('inner mod config onunloader!')
            }
          }
        }
      }
    })

    //state.h1 = '', 
    state.select = 2, state.textarea = 1
      //setTimeout(function() {
      //  console.log(state.h1, state.input)
      //}, 100)
  }
})

mag.module('app2', {
  view: function(s, p, e) {
    //s.b='first'
    s.data = mag.module('comp2', {
      view: function(s, p) {
        s.span = s.span || 'stuff'
        s.b = {
          _text: 'yoyo',
          _onclick: function() {
            s.span = s.span == 'stuff' ? 'other' : 'stuff'
            console.log('test', s.span)
              //mag.redraw(1)
          }
        }
      }
    }).then(function(data) {
      s.data = data
    })

  }
})


mag.module('app', {
  view: function(s, p1, e) {
    s.count = s.count || 1
    s.data = mag.module('comp', {
        view: function(s, p, e) {
          //console.log(c)
          s.b = p1.thingy
          s.count = p.changeling
          s.span = p.expr + '' + s.count
          s.head = {
            _onclick: function() {
              //console.log(c)
              s.span = 'yoyo'
              p1.thingy = s.b = p1.thingy == 'jay' ? 'thingy' : 'jay'
            }
          }
        }
      }, {
        expr: (s.count % 2 == 0 ? 'hm' : 'blow'),
        changeling: s.count
      }) // try cloning by adding a 1 last argument to see the difference
      .then(function(data) {
        //console.log('test', data._html())
        s.data = data
        s.span = {
          _onclick: function() {
            s.count++
          }
        }
      })
  }
})
