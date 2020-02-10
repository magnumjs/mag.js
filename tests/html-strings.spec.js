import mag from '../src/main'

describe("MagJS template literals", function () {

    beforeEach(() => {
        document.body.innerHTML = "<div id='root'></div>"
    })


    it("has template string with an attribute", ()=>{
        global.App = mag(
            `<b></b>`,
            function(props){
                return `Hello, world! ${props.date}`
            })

        const date = "2/10/2020, 2:24:38 PM"
        mag(
            mag`<App date="${date}" />`,
            document.getElementById('root')
        )
        expect(document.querySelector('#root b').textContent).toEqual("Hello, world! 2/10/2020, 2:24:38 PM")
    })

    it("has template string with an sub comp as attribute", ()=>{
        global.Bolder = mag(
            `<b></b>`,
            function(props){
                return mag`<div>Hello, world! ${props.date}</div>`
            })


        const date = "2/10/2020, 2:24:38 PM"
        const Dater = mag(`<i>Date: <span></span></i>`, props=>(props))

        mag(
            mag`<Bolder date=${Dater({span: date})} />`,
            document.getElementById('root')
        )
        expect(document.querySelector('#root b div').innerHTML).toEqual(`Hello, world! <i>Date: <span>${date}</span></i>`)
        expect(document.querySelector('#root b i span').textContent).toEqual(date)
    })

    it("tagged template literal inline", () => {


        global.App = mag(`<h1> <count/></h1>`, props => {

            const {count = 0} = props

            return {
                count,
                onclick:
                    e => App({
                        ...props, count: count + 1
                    })
            }
        })

        mag(
            mag`
            <b>HI
            <App key=1></App>
            <App key=2></App>
            </b>
            `,
            'root'
        )

        expect(document.body.querySelectorAll("count").length).toEqual(2)
        expect(document.body.querySelector("count").textContent).toEqual("0")

        document.querySelector("h1").click()

        expect(document.body.querySelector("count").textContent).toEqual("1")
    })



    it("tagged template literal variables", () => {

        const App2 = mag(`<h1> <count/></h1>`, props => {

            const {count = 0} = props

            return {
                count,
                onclick:
                    e => App2({
                        ...props, count: count + 1
                    })
            }
        })

        mag(
            mag`
            <b>HI
            ${App2({key: 1})}
            ${App2({key: 2})}
            </b>
            `,
            'root'
        )

        // expect(document.body.innerHTML).toEqual("")
        expect(document.body.querySelector("count").textContent).toEqual("0")

        document.querySelector("h1").click()

        expect(document.body.querySelector("count").textContent).toEqual("1")
    })
})