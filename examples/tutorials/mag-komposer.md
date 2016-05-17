##mag-komposer

Let's Compose MagJS Containers

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
