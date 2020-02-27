import mag from "../../src/mag"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})

test("tagged open static attrs with single child text", () => {


    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router default="/" >Inside</Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div>Inside</div>")

})

test("tagged key single", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    mag(mag`<App/>`, "root")
    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<p>test</p>")
})

test("tagged key single - re render", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    var Apper = mag("root", () => mag`<App/>`)
    Apper()
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test</p>")
    Apper()
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test</p>")
})

test("tagged key single - re render var", () => {
    mag.App = mag('<p>', props=>{
        return "test"+props.num
    })

    var Apper = mag("root", props => mag`<App num=${props.num}/>`)
    Apper({num: 1})
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test1</p>")
    Apper({num: 2})
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test2</p>")
})

test("tagged key double", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    mag(mag`<App/><App></App>`, "root")
    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<p>test</p><p>test</p>")
})



test("tagged key double - re render", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    var Apper = mag("root", () => mag`<App/><App></App>`)
    Apper()
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test</p><p>test</p>")
    Apper()
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test</p><p>test</p>")
})


test("tagged key double - re render var", () => {
    mag.App = mag('<p>', props=>{
        return "test"+props.num
    })

    var Apper = mag("root", props => mag`<App num=${props.num}/><App num=${props.num}></App>`)
    Apper({num: 1})
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test1</p><p>test1</p>")
    Apper({num: 2})
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test2</p><p>test2</p>")
})

test("tagged key triple", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    mag(mag`<App/><App /> <App/>`, "root")
    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<p>test</p><p>test</p> <p>test</p>")
})



test("tagged key triple - re render", () => {
    mag.App = mag('<p>', props=>{
        return "test"
    })

    var Apper = mag("root", () => mag`<App/><App /> <App/>`)
    Apper()
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test</p><p>test</p> <p>test</p>")
    Apper()
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test</p><p>test</p> <p>test</p>")
})


test("tagged key triple - re render var", () => {
    mag.App = mag('<p>', props=>{
        return "test"+props.num
    })

    var Apper = mag("root", props => mag`<App num=${props.num}/><App num=${props.num}></App> <App num=${props.num}  />`)
    Apper({num: 1})
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test1</p><p>test1</p> <p>test1</p>")
    Apper({num: 2})
    expect(document.querySelector('#root').innerHTML.trim()).toEqual("<p>test2</p><p>test2</p> <p>test2</p>")
})


test("array comps", () => {
    mag.Sub = mag('<b>', props => {
        return "test"
    })
    const App = mag('<p>', props=>{
        return mag`<Sub/><Sub></Sub>`
    })

    mag(App(), document.getElementById("root"))
    expect(document.querySelector('#root').innerHTML).toEqual(`<p>\n<b>test</b><b>test</b>\n</p>`)

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

