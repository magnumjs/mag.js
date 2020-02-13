import mag from "../src/mag"

// specs code
describe("MagJS comp return values with empty node", function () {
    beforeEach(() => {
        document.body.innerHTML = "<div id='root'></div>"
    })

    it("with html", function () {
        const App = mag('root', () =>{
            return "<h1>HI</h1>"
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("<h1>HI</h1>")
    })

    it("with html fragment", function () {
        const App = mag('root', () =>{
            return "<h1>HI</h1><p>TEST</p>"
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("<h1>HI</h1><p>TEST</p>")
    })

    it("with string", function () {
        const App = mag('root', () =>{
            return "HI"
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("HI")
    })


    it("with object", function () {
        const App = mag('root', () =>{
            return {}
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
    })
    it("with array", function () {
        const App = mag('root', () =>{
            return []
        })
        App()
        expect(document.getElementById('root')).toBeNull()
    })

    it("with null", function () {
        const App = mag('root', () =>{
            return null
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
    })

    it("with undefined", function () {
        const App = mag('root', () =>{
            return undefined
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
    })


    it("with 1 number", function () {
        const App = mag('root', () =>{
            return 1
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("1")
    })

    it("with 0 number", function () {
        const App = mag('root', () =>{
            return 0
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("0")
    })

    it("with false boolean", function () {
        const App = mag('root', () =>{
            return false
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("false")
    })

    it("with true boolean", function () {
        const App = mag('root', () =>{
            return true
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("true")
    })

})

describe("MagJS comp return null handling", function () {
    beforeEach(() => {
        document.body.innerHTML = `<div id='root'><div></div></div>`
    })

    it("single child node", function () {
        const App = mag('root', () => {
            return null
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
    })

    it("single child node and no return", function () {
        const App = mag('<h1>TEST</h1>', () => ({}))
        mag(App(),'root')
        expect(document.getElementById('root').innerHTML).toEqual("<h1>TEST</h1>")
    })

    it("single child node show hide", function () {
        const App = mag('root', props => {
            return props.show ? "HI": null
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
        App({show: true})
        expect(document.getElementById('root').innerHTML).toEqual("HI")
        App({show: false})
        expect(document.getElementById('root').innerHTML).toEqual("")
    })

    it("sub comp val", () => {
        const Sub= mag(`<h2></h2>`, props => {
            return "YO"
        })
        const App = mag('root', props => {
            return props.show ? {div: Sub()}: null
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
        App({show: true})
        expect(document.getElementById('root').innerHTML).toEqual("<div><h2>YO</h2></div>")
        App({show: false})
        expect(document.getElementById('root').innerHTML).toEqual("")
    })

    it("sub comp val tag", () => {
        const Sub= mag(`<h2></h2>`, props => {
            return "YO"
        })
        const App = mag('root', props => {
            return  {div: props.show? Sub():null}
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("<div></div>")
        App({show: true})
        expect(document.getElementById('root').innerHTML).toEqual("<div><h2>YO</h2></div>")
        App({show: false})
        expect(document.getElementById('root').innerHTML).toEqual("<div></div>")
    })

    it("sub comp val tag being false", () => {
        const Sub= mag(`<h2></h2>`, props => {
            return "YO"
        })
        const ResetTimer = mag(`<button>Reset Code</button>`, () => ({onclick: e=>{
            ResetApp({reset: 1})
            ResetApp({reset: 0})
        }}))

        const div = document.createElement('div')
        div.id = 'reset'
        document.body.appendChild(div)

        mag(ResetTimer(), "reset")

        const ResetApp = mag(
            'root',
            props => ({div: props.reset?null:Sub()})
        )

        ResetApp()
        expect(document.getElementById('root').innerHTML).toEqual("<div><h2>YO</h2></div>")
        document.querySelector('button').click()
        expect(document.getElementById('root').innerHTML).toEqual("<div><h2>YO</h2></div>")
    })
})

describe("MagJS comp return values with single child node", function () {
    beforeEach(() => {
        document.body.innerHTML = "<div id='root'><div></div></div>"
    })

    it("with string", function () {
        const App = mag('root', () =>{
            return "HI"
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("HI")
    })


    it("with object", function () {
        const App = mag('root', () =>{
            return {}
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("<div></div>")
    })
    it("with array", function () {
        const App = mag('root', () =>{
            return []
        })
        App()
        expect(document.getElementById('root')).toBeNull()
    })

    it("with null", function () {
        const App = mag('root', () =>{
            return null
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
    })

    it("with undefined", function () {
        const App = mag('root', () =>{
            return undefined
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("")
    })


    it("with 1 number", function () {
        const App = mag('root', () =>{
            return 1
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("1")
    })

    it("with 0 number", function () {
        const App = mag('root', () =>{
            return 0
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("0")
    })

    it("with false boolean", function () {
        const App = mag('root', () =>{
            return false
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("false")
    })

    it("with true boolean", function () {
        const App = mag('root', () =>{
            return true
        })
        App()
        expect(document.getElementById('root').innerHTML).toEqual("true")
    })

})