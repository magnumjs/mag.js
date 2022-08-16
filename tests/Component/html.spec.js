import mag from "../../src/mag"
import "../../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("focus", () =>{

    const Inputer = Mag(
        function ({ name }) {

            const handler = (e) => {
          // Call Component with Props and render:
          Inputer({ name: e.target.value});
        }
      
        return Mag`
         <p>
            Your name  
            ${name} thanks!
          </p>
          <input id="test" value="${name}" onInput="${handler}" />`
      })
      
      // Render Component with Props:
      Mag(
        Inputer(),
        document.getElementById("root")
      )

      document.querySelector("#root input").focus()
      document.querySelector("#root input").value='Mike'

     document.querySelector("#root input").dispatchEvent(new Event('input'))

     expect(document.querySelector("#root input").tagName).toEqual(document.activeElement.tagName)
      expect(document.querySelector("#root p").textContent).toContain("Mike")



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

            console.log('render', lightedness)

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

