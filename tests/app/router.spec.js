import mag from "../../src/mag"
import "../../src/hookins/mag.useContext"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})

test("router", ()=>{


    mag.Home = mag(`<b>`, ()=>"HOMEY")
    mag.About = mag(`<b>`, ()=>"ABOUTEY")

    mag.Nav = mag(`<nav>
      <li>Home</li>
      <li>About</li>
    </nav>`, props=> {
        return {
            $li : {
                onclick: e=> navigate("/"+e.target.textContent)
            }
        }
    })

    mag.Router =mag(
        `<div>`,
        props => {
            const [routerVals] = mag.useContext("router", { current: "/Home" })


            return props.children.find(child =>
                child.props.path == routerVals.current)


        })

    const navigate = function(name){
        const [, setRouter] = mag.useContext("router")
        setRouter({current: name})
    }

    var App = mag`
<Nav/>
<Router default="/Home">
<Home path="/Home"/>
<About path="/About" />
</Router>
`

    mag(App, "root")

    expect(document.querySelector('#root fragment div').innerHTML).toEqual("<b>HOMEY</b>")

    document.querySelector('#root nav li:nth-child(2)').click()

    expect(document.querySelector('#root fragment div').innerHTML).toEqual("<b>ABOUTEY</b>")

    document.querySelector('#root nav li:nth-child(1)').click()

    expect(document.querySelector('#root fragment div').innerHTML).toEqual("<b>HOMEY</b>")

    document.querySelector('#root nav li:nth-child(2)').click()

    expect(document.querySelector('#root fragment div').innerHTML).toEqual("<b>ABOUTEY</b>")
})