import mag from "../src/mag"
import "../src/hookins/mag.useState"

beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
})

test("fragment show hide", ()=>{
    const Page = mag(
        `
      <WarningBanner></WarningBanner>
      <button></button>
`,
        props => {

            const handleToggleClick = () => {
                Page ({
                    showWarning: !props.showWarning
                })
            }

            return {
                WarningBanner: props.showWarning ? "<h2>WARN</h2>" : null,
                button: {
                    _text: props.showWarning ? 'Hide' : 'Show',
                    onClick: handleToggleClick
                }
            }
        })

    mag(
        Page(),
        "root"
    )
    expect(document.querySelector('WarningBanner').textContent).toEqual("")
    expect(document.querySelector('button').textContent).toEqual("Show")
    document.querySelector('button').click()
    expect(document.querySelector('WarningBanner').textContent).toEqual("WARN")
    expect(document.querySelector('button').textContent).toEqual("Hide")
    document.querySelector('button').click()
    expect(document.querySelector('WarningBanner').textContent).toEqual("")
    expect(document.querySelector('button').textContent).toEqual("Show")
})

test("show and hide sub comp", () => {


const WarningBanner = mag(
    `<div class="warning">Warning!</div>`,
    props => {
        if (!props.warn) {
            return null;
        }

        return []
    })

const Page = mag(
    `<div>
      <WarningBanner></WarningBanner>
      <button></button>
   </div>`,
    props => {

        const [state, setState] = mag.useState({showWarning: true})

        const handleToggleClick = () => {
            setState(prevState => ({
                showWarning: !prevState.showWarning
            }))
        }

        return {
            WarningBanner: WarningBanner({warn: state.showWarning}),
            button: {
                _text: state.showWarning ? 'Hide' : 'Show',
                onClick: handleToggleClick
            }
        }
    })

mag(
    Page(),
    "root"
)

    expect(document.querySelector('.warning').textContent).toEqual("Warning!")
    expect(document.querySelector('button').textContent).toEqual("Hide")
    document.querySelector('button').click()
    expect(document.querySelector('.warning').textContent).toEqual("")
    expect(document.querySelector('button').textContent).toEqual("Show")
    document.querySelector('button').click()
    expect(document.querySelector('.warning').textContent).toEqual("Warning!")
    expect(document.querySelector('button').textContent).toEqual("Hide")

})

test("show and hide sub comp frag", () => {


const WarningBanner = mag(
    `<div class="warning">Warning!</div>`,
    props => {
        if (!props.warn) {
            return null;
        }

        return []
    })

const Page = mag(
    `<WarningBanner></WarningBanner>
      <button></button>`,
    props => {

        const [state, setState] = mag.useState({showWarning: true})

        const handleToggleClick = () => {
            setState(prevState => ({
                showWarning: !prevState.showWarning
            }))
        }

        return {
            WarningBanner: WarningBanner({warn: state.showWarning}),
            button: {
                _text: state.showWarning ? 'Hide' : 'Show',
                onClick: handleToggleClick
            }
        }
    })

mag(
    Page(),
    "root"
)

    expect(document.querySelector('.warning').textContent).toEqual("Warning!")
    expect(document.querySelector('button').textContent).toEqual("Hide")
    document.querySelector('button').click()
    expect(document.querySelector('.warning').textContent).toEqual("")
    expect(document.querySelector('button').textContent).toEqual("Show")
    document.querySelector('button').click()
    expect(document.querySelector('.warning').textContent).toEqual("Warning!")
    expect(document.querySelector('button').textContent).toEqual("Hide")

})