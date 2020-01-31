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
