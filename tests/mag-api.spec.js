import mag from "../src/main"

// specs code
describe("MagJS", function () {
    beforeEach(()=>{
        document.body.innerHTML = ""
    })
    it("is defined", function () {
        expect(mag).toBeDefined();
    });
    it("has public methods", function () {
        expect(mag.module).toBeDefined();
        expect(typeof mag == 'function').toBeTruthy();
        expect(mag.redraw).toBeDefined();
    })

    it("basic module with html string", function () {
        const App = mag("<b></b>", () => "HI")
        const ele = App()
        expect(ele).toBeDefined();
        expect(ele.outerHTML).toEqual("<b>HI</b>");
    });

    it("basic module with html string and prop", function () {
        const App = mag("<b> <name/></b>", () => ({name: "HI"}))
        const ele = App()
        expect(ele).toBeDefined();
        expect(ele.outerHTML).toEqual("<b> <name>HI</name></b>");
    });

    it("basic module with html string prop into body", function () {
        const App = mag("<b> <i/></b>", () => ({i: "HI"}))
        const ele = App()
        expect(ele).toBeDefined();
        expect(ele.outerHTML).toEqual("<b> <i>HI</i></b>");
        mag(App(), document.body)
       expect(document.body.innerHTML).toEqual("<b> <i>HI</i></b>");
    })

    it("basic module with body", function () {
        const App = mag(document.body, () => "HI")
        const ele = App()
        expect(ele).toBeDefined();
        expect(document.body.innerHTML).toEqual("HI");
    });
});
