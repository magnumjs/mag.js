
// specs code
describe("MagJS - module", function() {

beforeEach(function(){
  affix("div#test h2")
})

  it("is defined", function() {
    expect(mag.module).toBeDefined();
  });
  it("is accepts three argument", function() {
    
    spyOn(mag, 'module') 
    mag.module('test')
    expect(obj.method).toHaveBeenCalledWith('test')
  });

});
