import mag from '../../src/core/mag-stateless'
import "../../src/hookins/mag.useContext"

describe("useContext", () =>{


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})

it("useContext hook - two counters updating with tags", () => {
    mag.useContext('counter', 0)

    global.Counter =mag(
        '<div class="counter">clicked <count/><button>count</button></div>',
        props => {

            const [count,setCount] = mag.useContext('counter')

            return {
                count, button : {
                    onclick: e=> setCount(count + 1)
                }
            }
        })

    var App = mag`<Counter key=1/><Counter key=2 />`

    mag(
        App,
        "root"
    )


    expect(document.querySelectorAll('#root .counter').length).toEqual(2)
    expect(document.querySelector('#root .counter:nth-child(1) count').innerHTML).toEqual("0")
    expect(document.querySelector('#root .counter:nth-child(2) count').innerHTML).toEqual("0")
    document.querySelector('#root button').click()
    expect(document.querySelector('#root .counter:nth-child(1) count').innerHTML).toEqual("1")
    expect(document.querySelector('#root .counter:nth-child(2) count').innerHTML).toEqual("1")
    document.querySelector('#root button').click()
    expect(document.querySelector('#root .counter:nth-child(1) count').innerHTML).toEqual("2")
    expect(document.querySelector('#root .counter:nth-child(2) count').innerHTML).toEqual("2")
})

it("useContext hook - two counters updating with frag array sub comps", () => {
    mag.useContext('counter2', 0)

    var Counter =mag(
        `<div class="counter">clicked <count/><button>count</button></div>`,
        props => {

            const [count,setCount] = mag.useContext('counter2')

            return {
                count, button : {
                    onclick: e=> setCount(count + 1)
                }
            }
        })


    var App =mag(
        `<div/>`,
        props =>{

            return [
                Counter({key:1}),
                Counter({key:2})
            ]
        })

    mag(
        App(),
        "root"
    )


    expect(document.querySelectorAll('#root .counter').length).toEqual(2)
    expect(document.querySelector('#root .counter:nth-child(1) count').innerHTML).toEqual("0")
    expect(document.querySelector('#root .counter:nth-child(2) count').innerHTML).toEqual("0")
    document.querySelector('#root button').click()
    expect(document.querySelector('#root .counter:nth-child(1) count').innerHTML).toEqual("1")
    expect(document.querySelector('#root .counter:nth-child(2) count').innerHTML).toEqual("1")
    document.querySelector('#root button').click()
    expect(document.querySelector('#root .counter:nth-child(1) count').innerHTML).toEqual("2")
    expect(document.querySelector('#root .counter:nth-child(2) count').innerHTML).toEqual("2")
})
})