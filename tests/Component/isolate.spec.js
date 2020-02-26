import mag from "../../src/mag"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("isolate selectors", () => {


    var Welcome = mag (
        '<p>Hello, <name/></p>',
        function (props) {

            return {
                name: props.key+ (props.hide?props.hide:"")
            }
        })


    var greeter = `<p>TEST</p><hide/><more/>`
    var App =mag(greeter, ({hide}) =>{
        return {
            hide,
            more: Welcome({key: "test", hide}),
            p: {onclick: e=> App({hide: !hide})}
        }
    })

    mag(
        App(),
        "root"
    )

    expect(document.querySelector('#root hide').textContent).toEqual("")

    document.querySelector('#root p').click()

    expect(document.querySelector('#root hide').textContent).toEqual("true")
    document.querySelector('#root p').click()
    expect(document.querySelector('#root hide').textContent).toEqual("false")

})

test("isolate tagged selectors", () => {


    var Welcome = mag (
        '<p>Hello, <name/></p>',
        function (props) {

            return {
                name: props.key+ (props.hide?props.hide:"")
            }
        })


    var greeter = mag`<p>TEST</p><hide/><more/>`
    var App =mag(greeter, ({hide}) =>{
        return {
            hide,
            more: Welcome({key: "test", hide}),
            p: {onclick: e=> App({hide: !hide})}
        }
    })

    mag(
        App(),
        "root"
    )

    expect(document.querySelector('#root hide').textContent).toEqual("")

    document.querySelector('#root p').click()

    expect(document.querySelector('#root hide').textContent).toEqual("true")
    document.querySelector('#root p').click()
    expect(document.querySelector('#root hide').textContent).toEqual("false")
})