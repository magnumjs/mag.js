import "./jestGlobalMocks"
import mag from '../src/mag'
import {useEffect} from "../src/hookins/mag.useEffect"


const func = ()=>{
    console.log("onload")

    return () => {
        console.log("on remove")
    }
}



const Naver = mag(`<nav><p></p></nav>`, props => {

    useEffect(func,[props.name]);

    return {p: {_text: "test", _onclick: e=> {

        Naver({name: "test"})
    }}}
})

const App = mag(`<div><button>CLICK</button><put></put></div>`, ({remove}) => {
    return {put: remove?null:Naver(), button: {onclick: e => {
        App({remove: !remove})
    }}}
})


test("useEffect onload", () => {
    mag(App(), document.body)
    expect(document.querySelector("nav")).toBeDefined()
    expect(document.querySelector("p").textContent).toEqual("test")
    document.querySelector("p").click()
})

test("useEffect onload and change", () => {
    mag(App(), document.body)
    expect(document.querySelector("nav")).toBeDefined()
    expect(document.querySelector("p").textContent).toEqual("test")
    document.querySelector("p").click()
})

test("useEffect onload and unload", () => {
    mag(App(), document.body)

    expect(document.querySelector("nav")).toBeDefined()
    expect(document.querySelector("p").textContent).toEqual("test")
    document.querySelector("p").click()


    document.querySelector("button").click()

    document.querySelector("button").click()

})


