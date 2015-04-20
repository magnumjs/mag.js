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
    var view = {
      view: function(e, p, s) {
        s.h2 = 'tester'
      }
    }
    spyOn(mag, 'module').andCallThrough()

    mag.module('test', view)
    expect(mag.module).toHaveBeenCalledWith('test', view)

    waits(16) // 16 frames

    runs(function() {
      expect($('#test h2').text()).toEqual('tester')
    });

  });

});
