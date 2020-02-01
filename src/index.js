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

const CounterApp = mag('counters', props =>
  props.counters.map((name, key) => Counter({name, key}))
);

CounterApp({counters: ['first', 'second']});

const TimerHTML = `
<div><key></key>The count is: <count/></div>
`
const Timer = mag(TimerHTML, props => {
    const [count, setCount] = mag.useState(0)
    console.log("render", count, props)

    mag.useEffect(() => {
        const intervalId = setInterval(() => {
            //let's pass a function instead
            //the argument is the current state
            setCount(count => {
                console.log("inter", count, props)

                return count + 1
            })
        }, 1000)
        return () => {
            console.log("destory RESETER")
            clearInterval(intervalId)
        }
    }, [])

    return {count, key: props.key}
})

const Reset = mag(`<button>Reset Code</button>`, () => ({onclick: e=>{
    App({reset: 1})
}}))

mag(Reset(), "reset")

let inc = 0;
const TimerFactory = reset => reset?Timer({key: ++inc}): Timer()

//Define:
const App = mag(
    'root',
    props => ({put: TimerFactory(props.reset)})
)

//Mount:
App()






const func = () => {
  console.log('onload');

  return () => {
    console.log('on remove');
  };
};

const Naver = mag(`<div>The count is: <count/></div>`, props => {
  const [count, setCount] = mag.useState(0);
    console.log('render NAVER', count);

  mag.useEffect(() => {
    console.log('onload');
    const intervalId = setInterval(() => {
      //let's pass a function instead
      //the argument is the current state
      setCount(count => count + 1);
    }, 1000);
    return () => {
      console.log('destory NAVER');
      clearInterval(intervalId);
    };
  }, []);

  return {count};
});

const TimerApp = mag(
  `<div><button>Remove</button><put></put></div>`,
  ({remove}) => {
    return {
      put: remove ? null : Naver(),
      button: {
        onclick: e => {
          TimerApp({remove: !remove});
        }
      }
    };
  }
);

mag(TimerApp(), 'timer');
