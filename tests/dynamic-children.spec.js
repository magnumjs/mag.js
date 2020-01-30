import mag from "../src/main"


const Things = mag(`<i>Stuff - <tag></tag></i>`, props => {
    return {tag: props.tag}
})

const Nav = mag(
    `<nav><ul><li>Home</li><li>Dash</li></ul><children></children><p><active></active></p></nav>`,
    ({handler, active, children}) => {

        return {
            children,
            active,
            $li: {onClick: e=> {
                handler(e.target.textContent)
            }}
        }
    })

const App = mag(
    `<div><h1>Hi</h1><div><things></things></div></div>`,
    ({active="home"}) =>{

        return {
            things: Things({tag: active}),
            div: Nav({active, handler: active => {
                App({active})
            }})
        }
    })




test("children single", ()=>{
    mag(App(), document.body)
    expect(document.querySelector("nav")).toBeDefined()
    expect(document.querySelectorAll("nav > children").length).toEqual(1)
    expect(document.querySelectorAll("nav > ul > li").length).toEqual(2)
    expect(document.querySelectorAll("ul > li").item(1).textContent).toEqual("Dash")
    document.querySelectorAll("ul > li").item(1).click()
    expect(document.querySelector("tag").textContent).toEqual("Dash")
})