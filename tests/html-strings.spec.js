import mag from '../src/core/mag-stateless'

describe("MagJS template literals", function () {

    beforeEach(() => {
        document.body.innerHTML = "<div id='root'></div>"
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