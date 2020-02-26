import mag from "../../src/mag"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("tagged closed static attrs", () => {


    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router default="/" />`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div></div>")

})

test("tagged open static attrs", () => {


    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router default="/" ></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div></div>")

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
test("tagged open static attrs with single child element", () => {


    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router default="/" ><b>Inside</b></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><b>Inside</b></div>")

})

test("tagged static children", () => {


    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router><b>NAME</b></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><b>NAME</b></div>")

})

test("tagged dynamic child without attr", () => {

    mag.Home = mag(`<p/>`, props=>{
        return "HOMEY"
    })

    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router><Home/></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><p>HOMEY</p></div>")

})

test("tagged dynamic child with attr", () => {

    mag.Home = mag(`<p/>`, props=>{
        return "HOMEY"+props.test
    })

    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router><Home test=123/></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><p>HOMEY123</p></div>")

})

test("tagged dynamic children tags", () => {

    mag.Home = mag(`<p/>`, ()=>"HOMEY")
    mag.About = mag(`<p/>`, ()=>"ABOUTEY")

    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router default="/"><Home path="/"/><About path="/about" /></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><p>HOMEY</p><p>ABOUTEY</p></div>")

})

test("tagged dynamic children tags switch", () => {

    mag.Home = mag(`<p/>`, ()=>"HOMEY")
    mag.About = mag(`<p/>`, ()=>"ABOUTEY")

    mag.Router =mag(
        `<div/>`,
        props =>
            props.children.map(child =>
                child.props.path == props.default && child)
        )

    var App = mag`<Router default="/"><Home path="/"/><About path="/about" /></Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><p>HOMEY</p></div>")

})

test("tagged dynamic children nodes", () => {

    mag.Home = mag(`<p/>`, ()=>"HOMEY")
    mag.About = mag(`<p/>`, ()=>"ABOUTEY")

    mag.Router =mag(
        `<div/>`,
        props => {
            return props.children

        })

    var App = mag`<Router>${mag.Home({path: "/"})}${mag.About({path: "/about"})}</Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><p>HOMEY</p><p>ABOUTEY</p></div>")

})


test("tagged dynamic children with parrent attr", () => {

    mag.Home = mag(`<p/>`, ()=>"HOMEY")
    mag.About = mag(`<p/>`, ()=>"ABOUTEY")

    mag.Router =mag(
        `<div/>`,
        props =>  props.children.map(child =>
                child.props.path == props.default && child)
        )

    var App = mag`<Router default="/">${mag.Home({path: "/"})}${mag.About({path: "/about"})}</Router>`

    mag(App, "root")

    expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual("<div><p>HOMEY</p></div>")

})

