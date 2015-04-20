function afterDraw(expect) {
  waits(32)

  runs(function() {
    expect()
  });
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

    var view = {
      controller: function(p) {
        this.p = [1, 2]
      },
      view: function(e, p, s) {
        s.h2 = 'tester'
        s.b = {
          _onclick: function() {
            s.p = [2]
          }
        }
      }
    }

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
});
