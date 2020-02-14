import mag from "../../src/mag"
import "../../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("invalid open html tag string", () => {


    const Room = mag(
        `<div class='room'>
      the room is <lightedness />
      <br />
      <button>flip</button>
  </div>`,
        props => {

            const [isLit, setLit] = mag.useState(true)
            const lightedness = isLit ? "lit" : "dark"

            return {
                _class: "room "+lightedness,
                lightedness,
                button:{
                    onClick: () => setLit(!isLit)
                }
            }
        })

    mag(Room(), document.getElementById("root"))

    expect(document.querySelector("#root lightedness").innerHTML).toEqual("lit")
    document.querySelector("#root button").click()
    expect(document.querySelector("#root lightedness").innerHTML).toEqual("dark")

})

