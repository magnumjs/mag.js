import mag from "../src/hookins/mag.useState"

document.body.innerHTML = `
<app>
    <div id="toggle">
      <button>TOGGLER
      </button>
    </div>
  </app>
  
  
  
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


const Toggle = mag("toggle", props => {
    const [get, set] = mag.useState(false)

    return {
        button: {
            _onClick: ()=>set(!get),
            _text: get ? "ON" : "OFF"
        }
    };
});


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
    counters: props.counters.map((name, id) => Counter({name, key: id}))
}))


test("Toggle useRender", ()=>{
    Toggle()
    expect(document.querySelector("button")).toBeDefined()
    expect(document.querySelector("button").textContent).toEqual("OFF")
    document.querySelector("button").click()
    expect(document.querySelector("button").textContent).toEqual("ON")
})

test("Counter useRender", ()=>{

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
