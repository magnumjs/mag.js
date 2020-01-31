import mag from './main';
import {useEffect} from './hookins/mag.useEffect';
import {useState} from './hookins/mag.useState';

const CounterHTML = `
<div class="counter">
  <p>You clicked <count></count> times</p>
  <button>
    Click me
  </button>
</div>
`;

//Define instance:
const Counter = mag(CounterHTML, props => {
  const [count, setCount] = useState(0);

  return {
    count,
    button: {
      onClick: e => setCount(count + 1)
    }
  };
});

//Run instance

const App = mag('root', props =>
  props.counters.map((name, key) => Counter({name, key}))
);

App({counters: ['first', 'second']});


const func = ()=>{
    console.log("onload")

    return () => {
        console.log("on remove")
    }
}



const Naver = mag(`<div>The count is: <count/></div>`, props => {

    console.log("render")
    const [count, setCount] = mag.useState(0)

    mag.useEffect(() => {
      console.log("onload")
        const intervalId = setInterval(() => {
            //let's pass a function instead
            //the argument is the current state
            setCount(count => count + 1)
        }, 1000)
        return () => {
            console.log("destory")
            clearInterval(intervalId)
        }
    }, [])

    return {count}
})

const TimerApp = mag(`<div><button>Remove</button><put></put></div>`, ({remove}) => {
    return {put: remove?null:Naver(), button: {onclick: e => {
        TimerApp({remove: !remove})
    }}}
})

mag(TimerApp(), 'timer')


