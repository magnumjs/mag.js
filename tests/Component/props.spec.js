import mag from "../../src/mag"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})

test("tagged key single", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    mag(mag`<App/>`, "root")
    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<p>test</p>")
})

test("tagged key double", () => {
    mag.App = mag('<p>', props=>{
        console.log("props", props)
        return "test"
    })

    mag(mag`<App/><App></App>`, "root")
    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<p>test</p><p>test</p>")
})

test("merged props", () => {


    const App = mag('<p>', props=>{

    })

    mag(App({first: 1}), document.getElementById("root"))
    expect(App.props.first).toBeDefined()

    App({second: 2})
    expect(App.props.first).toBeDefined()
    expect(App.props.second).toBeDefined()

})

