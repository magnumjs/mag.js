# Tutorial: Stateless Functional Components

"The structure of any good app is one that doesn't think about state."

Creating the app foundation is done by breaking up chunks of display and its associated display logic into building blocks that can be pieced together.
But are not tightly coupled:


```js
const GreeterApp = props => ({
  h1: Greeter(props),
  ...isCheckedIn(params),
  ...(props.checkedIn ? CheckOut(props)  : CheckIn(props))
})

const render = mag("body", GreeterApp)
```

[Try it on JSBin](https://jsbin.com/meqaxamonu/edit?js,output)

Declarative and descriptive functional components are easy to comprehend and mentally model.

```js
const params={
  name: "Mike",
  handleCheckoutClick: props => {
    params.checkedIn=false
    alert(`Thanks ${props.name} see you soon!`)
    render(params)
  },
  handleCheckinClick: props =>{
    params.checkedIn=true
    alert(`Welcome ${props.name} enjoy your stay!`)
    render(params)
  },
  checkedIn:false}
```

[More on Components](//github.com/magnumjs/mag.js/blob/master/examples/tutorials/build-with-magjs-tutorial-components.md)
