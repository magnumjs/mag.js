// import mag from './main'
// import magAddons from './mag.addons.0.2'
import mag from './hookins/mag.useState'

//define instance
const Counter = mag("counter", props => {

    const [count, setCount] = mag.useState(0)

    return {
        count,
        button: {
            onClick: ()=>setCount(count + 1)
        }
    };
});

// Run instance
// Counter()


const App = mag("app", props =>({
    // counter1: Counter(),
    // counter2: Counter()
    counters: props.counters.map((name, key) => Counter({name, key}))
}))


const counters = ['first', 'second']
App({counters})