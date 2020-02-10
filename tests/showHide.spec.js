import mag from "../src/main"
import "../src/hookins/mag.useState"

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
    document.body
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