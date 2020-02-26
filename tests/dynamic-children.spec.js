import mag from "../src/mag"

beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("children single", ()=>{

    const Things = mag(`<i>Stuff - <tag></tag></i>`, props => {
        console.log("render", props.tag)
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
    mag(App(), "root")
    expect(document.querySelector("nav")).toBeDefined()
    expect(document.querySelectorAll("nav > children").length).toEqual(1)
    expect(document.querySelectorAll("nav > ul > li").length).toEqual(2)
    expect(document.querySelectorAll("ul > li").item(1).textContent).toEqual("Dash")
    document.querySelectorAll("ul > li").item(1).click()
    expect(document.querySelector("active").textContent).toEqual("Dash")
    expect(document.querySelector("tag").textContent).toEqual("Dash")
})

test("fragment", ()=>{

    var App = mag('<button>CLICK</button><more/>', ()=>{

        return {
            more: "test",
            onclick: e => {
                console.log("CLICKED")
            }
        }
    })

    mag(App(), "root")

    document.querySelector('#root button').click()
    expect(document.querySelector('#root').innerHTML).toEqual("<fragment><button>CLICK</button><more>test</more></fragment>")
})


test("isolate", ()=>{


    var More =  mag('<button>CLICK</button><p/>', ()=>{
        return {
            onclick: e => console.log("clicked")
        }

    })
    var App = mag('<button>CLICK</button><more/>', ()=>{

        return {
            more: More(),
            onclick: e => {
                console.log("CLICKED")
            }
        }
    })

    mag(App(), "root")
    document.querySelector('#root button').click()
    document.querySelector('#root more button').click()

})

