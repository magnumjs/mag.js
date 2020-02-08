import mag from './main';
import {useEffect} from './hookins/mag.useEffect';
import {useState} from './hookins/mag.useState';



const FancyBorder = mag(
    `<div>
      <f-children />
    </div>`,
    props => {
    return {
        _class: "FancyBorder FancyBorder-"+ props.color,
        "f-children": props.children
    }
})

const Dialog = mag(
    `<FancyBorder>
      <h1 class="Dialog-title"></h1>
      <p class="Dialog-message"></p>
      <d-children></d-children>
    </FancyBorder>`,
    props => {
    return {
        _html: FancyBorder({color: "blue"}),
        "d-children": props.children,
        "Dialog-title": props.title,
        "Dialog-message": props.message,
    }
})

const SignUpDialog = mag(
    `<Dialog open>
    <input />
    <button>
    Sign Me Up!
    </button>
  </Dialog>`,
    ({login =''}) => {

    const handleChange = e => {
        SignUpDialog({login: e.target.value});
    }

    const handleSignUp = () =>{
        alert(`Welcome aboard, ${login}!`);
    }

    return {
        _html : Dialog({
            title:"Mars Exploration Program",
            message:"How should we refer to you?"
        }),
        input:{onChange: handleChange},
        button: {onClick: handleSignUp}
    }
})

mag(
    SignUpDialog(),
    document.getElementById('diag-root3')
)




const FancyBorder1=mag(
    `<div class="fancy">
<fchildren></fchildren>
</div>`,
    ({children: fchildren})=>({fchildren})
)
const Dialog1=mag(`
<div>
<FancyBorder>
<div>
<h2 class="title"></h2>
<children></children>
</div>
</FancyBorder>
</div>
`,
    props=>({
        FancyBorder:FancyBorder1(),
        title: props.title,
        children:props.children
    })
)

const SignupDialog1=mag(`
<div>
<div class="dialog">
<div>
<span>hello.. <name></name>
</span>
<br>
<input placeholder="your name" />
</div>
</div>
</div>
`,
    props=>{
        return{
            dialog: Dialog1({title: props.name}),
            name:props.name,
            input: {
                _value: props.name,
                oninput: e => SignupDialog1({
                    name: e.target.value
                })
            }}
    }
)

//Define:
const App1 = mag(
    'diag-root1',
    props => SignupDialog1()
)
//Run:
App1()


const FancyBorder2=mag(
    `<div class="fancy" style="padding:20px;border: solid 10px blue;">
<childs></childs>
</div>`,
    ({children})=>({childs: children})
)
const Dialog2=mag(`
<FancyBorder>
TOP
<children></children>
<h2 class="title"></h2>
BOT
</FancyBorder>
`,
    props=>({
       _html: FancyBorder2(),
        title: props.title,
        children:props.children
    })
)

const SignupDialog2=mag(`
<div class="dialog">
hello.. <name></name>
<br>
<input placeholder="your name" />
</div>
`,
    props=>{
        return{
            _html: Dialog2({title: props.name}),
            name:props.name,
            input: {
                _value: props.name,
                oninput: e => SignupDialog2({
                    name: e.target.value
                })
            }}
    }
)

//Define:
const App2 = mag(
    'diag-root2',
    props => SignupDialog2()
)
//Run:
App2()



mag.module("mod",{
    view: function(state){
        state.h1 = 123
    }
})

const Mod = mag(`<div><h2></h2></div>`, {
    view: function(state, props){
        state.h2 = 'MIKE'
    }
})

mag(Mod({name: "mike"}), 'mod2')

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


const ResetTimerHTML = `
<div>Resetter: The count is: <count/></div>
`
const ResetTimerComp = mag(ResetTimerHTML, props => {
    const [count, setCount] = mag.useState(0)
    console.log("render", count)

    mag.useEffect(() => {
        const intervalId = setInterval(() => {
            //let's pass a function instead
            //the argument is the current state
            setCount(count => count + 1)
        }, 5000)
        return () => {
            console.log("destory")
            setCount(0)
            clearInterval(intervalId)
        }
    }, [])

    return {count}
})

const ResetTimer = mag(`<button>Reset Code</button>`, () => ({onclick: e=>{
    ResetApp({reset: 1})
    ResetApp({reset: 0})
}}))

mag(ResetTimer(), "reset2")

//Define:
const ResetApp = mag(
    'resetapp',
    props => ({timer: props.reset?null:ResetTimerComp()})
)

//Mount:
ResetApp()
