import mag from "../src/mag"

let AppSingle, AppLoop

beforeEach(()=>{
document.body.innerHTML = `
<div id="app">
<thing>
  <i>INNNER Children 
    <b>HTML</b></i>
</thing>
</div>


<div class="hello">
<h3>Hello World</h3>
<div></div>
</div>
`


const Hello = mag('hello', props => {
    return {
        div: {
            _html: props.children
        }
    }
})

AppLoop = mag("app", props => ({
    thing: props.items.map((name, key) => Hello({name, key}))
}))

 AppSingle = mag("app", props => ({
    thing: Hello()
}))
})

test("props.children single", ()=>{
    AppSingle()
    expect(document.querySelector("thing")).toBeDefined()
    expect(document.querySelectorAll("#app > thing").length).toEqual(1)
    expect(document.querySelector("thing .hello h3").textContent).toEqual("Hello World")
    expect(document.querySelector("thing .hello div thing i b").textContent).toEqual("HTML")
})

test("props.children loop", ()=>{
    AppLoop({items: ["first", "second"]})
    expect(document.querySelector("thing")).toBeDefined()
    expect(document.querySelectorAll("#app thing").length).toEqual(2)
    //expect(document.querySelectorAll("#app thing").item(0).querySelector("i b").textContent).toEqual("HTML")
    // expect(document.querySelectorAll("#app > thing").item(1).querySelector("i b").textContent).toEqual("HTML")
})