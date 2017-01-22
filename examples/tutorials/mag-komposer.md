##mag-komposer

Let's Compose MagJS Containers (inspired by [React-Komposer](https://github.com/kadirahq/react-komposer))

Let's compose MagJS containers and feed data into components. 

###Why?

Lately, in MagJS we tried to avoid states as possible we can and use props to pass data and actions.
So, we call these components Dumb Components or UI components.

And there is another layer of components, which knows how to fetch data. We call them as Containers.
Containers usually do things like this:

* Request for data (invoke a subscription or just fetch it).
* Show a loading screen while the data is fetching.
* Once data arrives, pass it to the UI component.
* If there is an error, show it to the user.
* It may need to refetch or re-subscribe when props changed.
* It needs to cleanup resources (like subscriptions) when the container is unmounting.
* If you want to do these your self, you have to do a lot of repetitive tasks. And this is good place for human errors.

Meet Mag Komposer

That's what we are going to fix with this project.
You simply tell it how to get data and clean up resources. 
Then it'll do the hard work you.

This is a universal project and work with any kind of data source, whether it's based Promises, Rx.JS observables or even Meteor's Tracker.

## Basic Usage

Let's say we need to build a clock. First let's create a component to show the time.

```js
const Timer = {view: (state, props) => { state.time = props.time }};
```
```html
<div id="timer">
  <b>Time: </b>
  <time></time>
</div>
```

Now let's define how to fetch data for this:

```js
const onPropsChange = (props, onData) => {
  const handle = setInterval(() => {
    const time = Date();
    onData({time});
  }, 1000);

  const cleanup = () => clearInterval(handle);
  return cleanup;
};
```

On the above function, we get data for every seconds and send it via `onData`. Additionally, we return a cleanup function from the function to cleanup it's resources.

Okay. Now it's time to create the clock:

```js
const Clock = mag.komposer(onPropsChange)(mag.create('timer', Timer));
```

That's it. Now render the clock to the DOM.

```js
mag.module(document.body,{view: () => { Clock() }});
```

See this live: <http://jsbin.com/howojexali/edit?js,output>

With loading container: <http://jsbin.com/nedekepane/edit?js,output>

As dynamic node: <http://jsbin.com/xacudopege/edit?html,js,output>

[Simple example](http://embed.plnkr.co/RkCuy0xoyUZyMjSPRKeH/)

[Full working example](http://embed.plnkr.co/LoI7vOx1KAZkaA8dZSJX/)
<hr>

[Tutorials](https://github.com/magnumjs/mag.js/tree/master/examples/tutorials) - [Addons](https://github.com/magnumjs/mag.js/tree/master/src/addons)
