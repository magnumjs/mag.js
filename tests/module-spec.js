var view = {
  controller: function(p) {
    this.p = [1, 2]
    this.b = 'TEST'
    this.h2 = {
      _text: 'tester',
      _config: function(n, is, c, i) {
        c.count = c.count + 1 || 1
        console.log('called', c.count)
        c.onunload = function(context, node, path) {
          expect(path).toEqual('id("test")/H2[1]')
        }
      }
    }
  },
  view: function(s, p, e) {
    s.b = {
      _onclick: function() {
        s.p = [2]
        s.h2 = null
      }
    }
  }
}


// specs code
describe("MagJS - module", function() {

  beforeEach(function() {
    affix("div#test h2+p>b")

  })

  it("is defined", function() {
    expect(mag.module).toBeDefined();
  });
  it("accepts one argument", function() {

    spyOn(mag, 'module')
    mag.module('test')
    expect(mag.module).toHaveBeenCalledWith('test')
  });

  it("props are not modifiable", function() {

    mag.module('test', {
      controller: function(p) {
        expect(p.alwaysstay).toEqual(true)
        p.alwaysstay = false
      },
      view: function(s, p) {
        expect(p.alwaysstay).toEqual(false)
      }
    }, {
      alwaysstay: true
    })
  })


  it("lists change when state changes", function() {
    spyOn(mag, 'module').andCallThrough()
    mag.module('test', view)

    expect(mag.module).toHaveBeenCalledWith('test', view)

    expect($('#test h2').text()).toEqual('tester')
    expect($('#test p').length).toEqual(2)
    $('#test b').click()
    expect($('#test p').length).toEqual(1)
  });

  it("will call onunload after node is removed", function() {
    mag.module('test', view)
    $('#test b').click()
    expect($('#test h2').text()).toEqual('')
  })

  describe("list", function() {

    var mod = {
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
    }

    beforeEach(function() {
      var $main = affix('#lister h2>span')
      $main.affix('ul>li.item')
    })

    it("can reverse a list", function() {

      console.log($('#lister').html())

      var flag, promise = mag.module("lister", mod)

      runs(function() {
        promise.then(function(d) {
          flag = true
        })
      })


      waitsFor(function() {
        return flag;
      }, "Flag should be set", 10);

      runs(function() {
        expect($('#lister ul li').text()).toBe('123')
        $('#lister h2').click()
        expect($('#lister ul li').text()).toBe('321')
      })
    })

  })

});
