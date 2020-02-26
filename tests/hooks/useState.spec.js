import mag from '../../src/core/mag-stateless'
import "../../src/hookins/mag.useState"

document.body.innerHTML = `
<app>
    <div id="toggle">
      <button>TOGGLER
      </button>
    </div>
  </app>
      
  
<div id="togglep">
<button>TOGGLER
</button>
</div>
  
  
  
<div class="counter">
<p>You clicked <count></count> times</p>
<button>
Click me
</button>
</div>

<app2>
<counters></counters>  
</app2>
`




test("Toggle useRender", ()=>{

    const Toggle = mag("toggle", props => {
        const [get, set] = mag.useState(false)

        return {
            button: {
                _onClick: ()=>set(!get),
                _text: get ? "ON" : "OFF"
            }
        };
    });

    Toggle()
    expect(document.querySelector("#toggle button")).toBeDefined()
    expect(document.querySelector("#toggle button").textContent).toEqual("OFF")
    document.querySelector("#toggle button").click()
    expect(document.querySelector("#toggle button").textContent).toEqual("ON")
})


test("TogglePrevious useRender", ()=>{

    const TogglePrevious = mag("togglep", props => {
        const [get, set] = mag.useState(true)

        return {
            button: {
                _onClick: () =>set(get => !get),
                _text: get ? "ON" : "OFF"
            }
        };
    });
    TogglePrevious()
    expect(document.querySelector("#togglep button")).toBeDefined()
    expect(document.querySelector("#togglep button").textContent).toEqual("ON")
    document.querySelector("#togglep button").click()
    expect(document.querySelector("#togglep button").textContent).toEqual("OFF")
})

test("Counter useRender", ()=>{




//define instance
    const Counter = mag("counter", props => {
        const [count, setCount] = mag.useState(0)

        return {
            count,
            button: {
                _onClick: ()=>setCount(count + 1)
            }
        };
    });
// Run instance
//Counter({key: 1})


    const App = mag("app2", props =>({
        counters: props.counters.map((name, key) => Counter({name, key}))
    }))
    const counters = ['first', 'second']
    App({counters})
    expect(document.querySelectorAll("counters")).toBeDefined()
    expect(document.querySelectorAll("counters").length).toEqual(2)
    expect(document.querySelectorAll("counters count").item(0).textContent).toEqual("0")
    expect(document.querySelectorAll("counters count").item(1).textContent).toEqual("0")
    document.querySelectorAll("counters").item(0).querySelector("button").click()
    expect(document.querySelectorAll("counters count").item(0).textContent).toEqual("1")
    document.querySelectorAll("counters").item(1).querySelector("button").click()
    expect(document.querySelectorAll("counters count").item(1).textContent).toEqual("1")
    // document.querySelectorAll("counters").item(0).querySelector("button").click()
    // expect(document.querySelectorAll("counters count").item(0).textContent).toEqual("1")
    // document.querySelectorAll("counters").item(1).querySelector("button").click()
    // expect(document.querySelectorAll("counters count").item(1).textContent).toEqual("1")
})
