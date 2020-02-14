import Mag from "../src/mag"
import "../src/hookins/mag.useState"


beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>"
})


test("simple array with comps", () => {


    var Li = Mag('<li></li>', function (props) {
        return props.number
    })


    var Ul = Mag('<ul></ul>', function (props) {
        return props.numbers.map((number,key) => Li({number, key}))
    })

    Mag(Ul({numbers: [1,2,3]}), "root")

    expect(document.querySelectorAll('#root ul li').length).toEqual(3)
})

test("counters no mapping", ()=>{
    const CounterHTML = `
<div class="counter">
  <p>You clicked <count></count> times</p>
  <button>
    Click me
  </button>
</div>
`;

//Define instance:
    const Counter = Mag(CounterHTML, props => {
        const [count, setCount] = Mag.useState(0);

        return {
            count,
            button: {
                onClick: e => setCount(count + 1)
            }
        };
    });

//Run instance

    const CounterApp = Mag('root', props =>
        props.counters.map((name, key) => Counter({name, key}))
    );

    CounterApp({counters: ['first', 'second']});
    expect(document.querySelectorAll('.counter').length).toEqual(2)

})

test("counters", () => {


const CounterHTML = `
<div class="counter">
  <p>You clicked <count></count> times</p>
  <button>
    Click me
  </button>
</div>
`
    const Counter = Mag(CounterHTML, props => {
        return {
            count: props.count,
            button: {
                onClick: () => props.handler(props)
            }
        };
    });

    const App = Mag(`<app>
  Counters!
  <counters></counters>
</app>`, props => {
        const handler = sprops => {
            ++counters[sprops.key].count;
            App({ counters });
        };

        return {
            counters: props.counters.map((item, key) =>
                Counter({ ...item, handler, key })
            )
        };
    });

    const counters = [{ name: "first", count: 0 }, { name: "second", count: 0 }];

    Mag(App({ counters }), "root");

    expect(document.querySelectorAll('.counter').length).toEqual(2)

})