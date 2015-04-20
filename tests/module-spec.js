function afterDraw(expect) {
  waits(32)

  runs(function() {
    expect()
  });
}


var view = {
  controller: function(p) {
    this.p = [1, 2]
    this.h2 = {
      _text: 'tester',
      _config: function(n, is, c, i) {
        c.count = c.count + 1 || 1
        c.onunload = function(context, node, cache, path) {
          expect(context.count).toEqual(1)
          expect(path).toEqual('id("test")/H2[1]')
        }
      }
    }
  },
  view: function(e, p, s) {

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
  it("is accepts one argument", function() {

    spyOn(mag, 'module')
    mag.module('test')
    expect(mag.module).toHaveBeenCalledWith('test')
  });

  it("is accepts two arguments", function() {
    spyOn(mag, 'module').andCallThrough()
    mag.module('test', view)


    expect(mag.module).toHaveBeenCalledWith('test', view)

    afterDraw(function() {
      expect($('#test h2').text()).toEqual('tester')
      expect($('#test p').length).toEqual(2)
      $('#test b').click()
      afterDraw(function() {
        expect($('#test p').length).toEqual(1)
      });
    });
  });

  it("will call onunload after node is removed", function() {
    mag.module('test', view)
    afterDraw(function() {
      $('#test b').click()
      afterDraw(function() {
        expect($('#test h2').text()).toEqual('')
      });
    })
  })

});
