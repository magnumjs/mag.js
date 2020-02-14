import mag from "../../src/mag"
import "../../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("invalid open html tag", () => {


    global.App = mag(
        `<h1>im in a fancy component now!</h1>`,
        props => {
            // javascript stuff goes here

            return {}
        })

    mag(
        mag`<div>
    <App   />
  </div>`,
        document.getElementById('root')
    )

    expect(document.querySelectorAll("#root h1").length).toEqual(1)
})


test("invalid open html tags with one attribute without quotes", () => {


    global.App = mag(
        `<h1>im in a fancy component now!</h1>`,
        props => {
            // javascript stuff goes here

            return {}
        })

    mag(
        mag`<div>
    <App key=1 />
    <App key=2 />
    <App key=3 />
  </div>`,
        document.getElementById('root')
    )

    expect(document.querySelectorAll("#root h1").length).toEqual(3)
})

test("invalid open html tags with one attribute with quotes", () => {


    global.App = mag(
        `<h1>im in a fancy component now!</h1>`,
        props => {
            // javascript stuff goes here

            return {}
        })

    mag(
        mag`<div>
    <App key="1" />
    <App key="2" />
    <App key=3 />
  </div>`,
        document.getElementById('root')
    )

    expect(document.querySelectorAll("#root h1").length).toEqual(3)
})

test("invalid open html tags with two attribute without quotes", () => {


    global.App = mag(
        `<h1>im in a fancy component now!</h1>`,
        props => {
            // javascript stuff goes here

            return {}
        })

    mag(
        mag`<div>
    <App key="1" name=John />
    <App key="2" date=${new Date()} />
    <App key=3 />
  </div>`,
        document.getElementById('root')
    )

    expect(document.querySelectorAll("#root h1").length).toEqual(3)
})