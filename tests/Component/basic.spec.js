import "../jestGlobalMocks"
import mag from "../../src/mag"


beforeEach(() => {
    document.body.innerHTML = "<div id=\"root\"><h2></h2></div>\n"
})


test("Stateful Component basics", () => {

    expect(typeof mag).toBe("function")
    expect(typeof mag.module).toBe("function")

    mag.module("root", {
        controller: function(){

        },
        view: function(state, props){
            state.h2 = 'Hello!'
        }
    })
    jest.advanceTimersByTime(1000);

    expect(document.querySelector('#root h2').textContent).toEqual("Hello!")
})

test("stateless node", ()=>{
    const App = mag(
        `<div><h2></h2></div>`,
        ({name:h2}) =>
            ({h2})
    )

    mag(App({name: "mikey"}), 'root')

    expect(document.querySelector('#root h2').textContent).toEqual("mikey")
})

test("statefull node", () => {

    const App = mag(`<div><h2></h2></div>`, {
        view: function(state, props){
            state.h2 = props.name?props.name:'MIKE'
        }
    })
    mag(App(), 'root')
    jest.advanceTimersByTime(1000);

    expect(document.querySelector('#root h2').textContent).toEqual("MIKE")


    App({name: "mike"})

    jest.advanceTimersByTime(1000);

    expect(document.querySelector('#root h2').textContent).toEqual("mike")
})

