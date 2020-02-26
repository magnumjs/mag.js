import mag from '../src/mag'

describe("MagJS template literals", function () {

    beforeEach(() => {
        document.body.innerHTML = "<div id='root'></div>"
    })

    it("can take children with no root parent", () => {

        var App = mag`<li>one</li><li>two</li>`

        expect(typeof App).toEqual("object")
        expect(App.childElementCount).toEqual(2)
        expect(App.nodeType).toEqual(1)
        expect(App.childNodes.length).toEqual(4)
    })

    it("can take children with no root parent or func", () => {

        const App = mag`<li>one</li><li>two</li>`

        mag(App, "root")
        expect(document.querySelectorAll("li").length).toEqual(2)
    })

    it("can take children with no root parent", () => {

        const App = mag(`<li>one</li><li>two</li>`, ()=>({}))

        mag(App(), "root")
        expect(document.querySelectorAll("li").length).toEqual(2)
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

    it("has template string with an sub comp as attribute and child", ()=>{
        mag.Home = mag('<p/>', () => "HOME")
        global.Bolder = mag(
            `<b></b>`,
            function(props){
                return mag`<div>Hello, world! ${props.date}</div> ${props.children[0]}`
            })


        const date = "2/10/2020, 2:24:38 PM"
        const Dater = mag(`<i>Date: <span></span></i>`, props=>(props))

        mag(
            mag`<Bolder date=${Dater({span: date})} format="test"><Home/> ${mag.Home()}</Bolder>`,
            document.getElementById('root')
        )
        expect(document.querySelector('#root b div').innerHTML).toEqual(`Hello, world! <i>Date: <span>${date}</span></i>`)
        expect(document.querySelector('#root b i span').textContent).toEqual(date)
        expect(document.querySelector('#root b p').innerHTML).toEqual("HOME")
    })

    it("has template string with an string as attribute and child", ()=>{
        mag.Home = mag('<p/>', () => "HOME")
        global.Bolder = mag(
            `<b></b>`,
            function(props){
                return mag`<div>Hello, world! ${props.date}</div> ${props.children[0]}`
            })


        const date = "2/10/2020, 2:24:38 PM"
        const Dater = mag(`<i>Date: <span></span></i>`, props=>(props))

        mag(
            mag`<Bolder date=${date}><Home/></Bolder>`,
            document.getElementById('root')
        )
        expect(document.querySelector('#root b div').innerHTML).toEqual(`Hello, world! 2/10/2020,`)
        expect(document.querySelector('#root b p').innerHTML).toEqual("HOME")
    })

    it("has template string with an string as attribute and child node", ()=>{
        mag.Home = mag('<p/>', () => "HOME")
        global.Bolder = mag(
            `<b></b>`,
            function(props){
                return mag`<div>Hello, world! ${props.date}</div> ${props.children[0]}`
            })


        const date = "2/10/2020, 2:24:38 PM"
        const Dater = mag(`<i>Date: <span></span></i>`, props=>(props))

        mag(
            mag`<Bolder date=${date}>${mag.Home()}</Bolder>`,
            document.getElementById('root')
        )
        expect(document.querySelector('#root b div').innerHTML).toEqual(`Hello, world! 2/10/2020,`)
        expect(document.querySelector('#root b p').innerHTML).toEqual("HOME")
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



    it("tagged template literal variables 2 comps dom", () => {

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

        expect(document.querySelectorAll('h1').length).toEqual(2)
        expect(document.body.querySelector("count").textContent).toEqual("0")

        document.querySelector("h1").click()

        expect(document.body.querySelector("count").textContent).toEqual("1")
    })

    it("tagged template literal variables with mag", () => {

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
            ${App2({key: 3})}
            </b>
            `,
            'root'
        )

        expect(document.querySelectorAll('h1').length).toEqual(3)
        expect(document.body.querySelector("count").textContent).toEqual("0")

        document.querySelector("h1").click()

        expect(document.body.querySelector("count").textContent).toEqual("1")
    })
})