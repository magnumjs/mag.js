import Mag from "../src/main"


document.body.innerHTML =  "<div id='root'></div>"

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