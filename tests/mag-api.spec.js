import mag from "../src/main"
// specs code
describe("MagJS", function() {


  it("is defined", function() {
    expect(mag).toBeDefined();
  });
  
  it("has public methods",function(){
        expect(mag.module).toBeDefined();
        expect(mag.hookin).toBeDefined();
        expect(mag.redraw).toBeDefined();

        //Addons
        // expect(mag.prop).toBeDefined();
        // expect(mag.withProp).toBeDefined();

  })

});
