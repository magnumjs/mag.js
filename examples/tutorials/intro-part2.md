#Mag.JS: A Tutorial Introduction (Part2)

Welcome to part 2 of this tutorial series! In [part 1](https://github.com/magnumjs/mag.js/blob/master/examples/tutorials/intro-part1.md) we implemented the Contacts component. In part 2 we will first refactor the Contacts component to take advantage of MagJS's stellar component features. Then we will implement both the Total component and the Coupon component, all of which will be managed by MagJS algorithm under one parent component.

##Here's the demo!

Anxious? You can view the [code here](http://embed.plnkr.co/lgms6KqkMWBTk2fTcwVb/),
Before we dive back in, let's review our user stories:

##Project User Stories

As a user, I want to sign up for an event.
As a user, I want to sign up multiple people at once. (Covered by part 1)
As an organizer, I need at least one attendee email address to send event details to.
As an organizer, I want to charge $10 per attendee.
As an organizer, I want to provide coupons to offer a percent discount on total price.
Components

The Contacts component keeps track of all the attendees' information entered
The Total component will calculate the final price
The Coupon component will handle checking the validity of an entered coupon via AJAX.
A new (!) component VolunteerForm will manage the other three as their parent component.
Getting Started

If you want to code along, check out the Plunker link above and start in the first version in edit mode.

Keep in mind that the purpose of this project is to teach MagJS concepts, so it uses some non-best practices. In a real project you would minimize the use of DOM ids, concatenate and minify your JavaScript files, wrap your code in anonymous function scopes, and so on.

##Strategy

As it turns out, MagJS has stellar support for nesting components. Because other components are about to enter the mix, we will refactor the Contacts component to make it easier to nest.

After refactoring the Contacts component, we will build more components and connect them all together, so you can see how everything fits in one application.

This is the approach we will take:

Refactor the Contacts component
Create a parent VolunteerForm component and nest the Contacts component
Build the Total component and nest it in VolunteerForm
Build the Coupon component and also nest it in VolunteerForm
Enough talk, let's get started!

##1. The Moderate Refactor

When a MagJS component is nested, its parent can send extra options to its controller and view. Let's update the Contacts component so it "imports" its contacts data from these extra options:

```javascript
//contacts.js
Contacts.controller = function (props) {  
  var ctrl = this
  ctrl.contacts = options.contacts //<-- (!)

  ctrl.add = function () {
    var newModel = new Contacts.model()
    ctrl.contacts().push(newModel)
  }
  ctrl.remove = function (idx) {
    ctrl.contacts().splice(idx, 1)
  }
}
```

As it turns out, we only had to change two lines of code! First, we expect the new parameter props — the object properties that the parent component will send down (you will see what this looks like in the next section).

Second, instead of creating our array of contacts, we receive it from the parent via props.contacts (we still expect it to be an mag.prop, just like in part 1).

Notice how this component is mutating props.contacts directly. Because of this, we can say this is a mutative component; it mutates the data of its parent. This is by no means the only way to design a component; you will see other types later in the post.

##A Small View Tweak

In the Contacts view, remove the following line:

```javascript
state.h3 =  'Please enter your contact information:'  
```

Because we intend this component to be reusable, we leave the responsibility of labeling it to the parent (you'll see this in the next section).

##2. The VolunteerForm Component

It's time write the parent VolunteerForm component. If you're coding along, create a folder and the following new file. Let's look at both the controller and view at once:

```javascript
// volunteer-form.js
VolunteerForm = {}

VolunteerForm.controller = function () {  
  var ctrl = this
   ctrl.contacts = mag.prop([new Contacts.model()])  /*1*/
}

VolunteerForm.view = function (ctrl) {  
 ctrl['volunteer-form'] = {
    'h3': 'Please enter your contact information:'
  }, /*2*/
  
   ctrl.listcontacts = mag.module('contacts', Contacts, {
    contacts: ctrl.contacts
  }) /*3*/
  
}
```

This is where it gets exciting!

We've moved the model data to this new component's controller. In fact, any time you use a top-down component architecture like this, I strongly recommend storing / initializing all model data in the top-level component, and passing it down to nested child components as needed.

Here is where the h3 tag ended up. The parent holds responsibility for labeling the intent of the child component.

And here is where we actually nest the Contacts component! Here we use mag.module. If we nest a component in this fashion, then — when it comes time to render the page — MagJS will automatically initialize the nested component's controller and run its view function, all without the need for us to manage it ourselves!

Note that nested components play by the same rules as other components: controllers initialize once, and the view (eventually) runs many times.

##Mounting the Parent

Now that we're using a top-down component architecture, we need to update index.html to include our new file and mount VolunteerForm instead of Contacts.

```javascript
<!-- index.html -->  
<script src="volunteer-form.js"></script>

<script>  
mag.module('app', VolunteerForm)
</script> 
```

Our refactor is complete. If you refresh the page, you should see everything work as it did before.

##3. The Total Component

Now let's write the Total component. This component will display the total amount the user needs to donate for the signup application. Let's begin with the view:

```javascript
// total.js
Total.view = function(ctrl, props) {

  var total = Total.calcPrice(props.discount, props.count)
  var discountedAmount = Total.calcDiscount(props.discount, props.count)

  ctrl.span = props.discount > 0 ? "(Coupon discount: -$" + discountedAmount + ")" : ''
  ctrl.b = "$" + total

}
```

Here Total.calcPrice (implementation not shown yet) is a pure function that calculates the final price based on the component attributes. This is important to not only making the Total component reusable, but making the price calculation reusable as well (we will see the definition of this function shortly).

Also note that we don't use the ctrl variable. That's because, as it turns out, there is no controller!

```javascript
// total.js
Total = {}

/* Model-level functionality */
Total.pricePerCount = 10  
Total.calcPrice = function (discount, count) {  
  var total = count * Total.pricePerCount
  return roundCents(total - total * discount)
}

/* View */
Total.view = function (ctrl, options) {  
  // [clipped]
}

/* Helpers */
function roundCents (num) {  
  return Math.round(num * 100) / 100
}
```

As you can see, we do not define Total.controller at all. This is because MagJS does not require a component to have a controller. In fact, because the Total component does not have a controller, and does not mutate anything in options, we can say that Total is a stateless component.

As an aside, the nice thing about writing Total as its own component is we now have one place to go to if we need to modify anything total-related, whether it's changing how it looks on the page (Total.view) or changing the business logic (Total.calcPrice). Of course, if this file starts getting too big, you can always split it up into multiple files, while keeping everything in the same components/total/ folder.

##Nesting Total in VolunteerForm

Now we need to put the Total component on the page. To do so, there are two tasks to complete:

Add a discount mag.prop to the VolunteerForm controller
Nest the Total component within the VolunteerForm view and send down its properties: discount and number of volunteers.
Here is VolunterForm with the above updates:

```javascript
// volunteer-form.js
VolunteerForm.controller = function () {  
  var ctrl = this
  ctrl.contacts = mag.prop( [new Contacts.model()] )
  ctrl.discount = mag.prop(0) /*1*/
}

VolunteerForm.view = function (ctrl) {  
  ctrl['volunteer-form'] = {
    'h3': 'Please enter your contact information:'
  }
  ctrl.listcontacts = mag.module('contacts', Contacts, {
    contacts: ctrl.contacts
  })

  mag.module('total', Total, {
    count: ctrl.contacts().length,
    discount: ctrl.discount()
  })
}
```

Here we attach a new mag.prop discount to VolunteerForm. As previously mentioned, it's a good idea to attach all your model data to the top-level component, and then pass down data to child components as necessary.
Here is another example of nesting a component. This time we pass two extra options. Note how the Total component's view does not need to know where options.count comes from.
We made ctrl.discount an mag.prop in preparation for the Coupon component, which is coming up next :)

If you're coding along, refresh the page now. You should see the total update as you add and remove attendees.

##4. The Coupon Component

Lastly, let's implement the Coupon component. As mentioned in part 1, this tutorial will not cover server-side code. Instead, we will hard code some logic and take note of what would normally go on the server side.

In reality, you can still prototype a full front-end application without a server by mocking AJAX calls. We will explore this advanced concept later this section.
This component will be the most complicated one we've implemented so far. It needs to do the following:

- Allow the user to type in the coupon code
- Validate the user's coupon code on coupon form submit
  - If valid, then discount the total amount
  - If invalid, then display an error
To accomplish this, we will take the following approach:

  I. Implement the Coupon controller
 II. Implement the Coupon view
III. Include Coupon in the VolunteerForm component  
 IV. Add error handling for invalid coupons
  V. Show coupon discount in Total component view
I. The Coupon Controller

Let's first take a look at the Coupon controller:

```javascript
// coupon.js
Coupon.controller = function (props) {  
  var ctrl = this
  ctrl.code = mag.prop('') /* 1 */
  ctrl.onSubmit = function (e) { /* 2 */
    e.preventDefault()
    validateCoupon(ctrl.code()) /* 3 */
      .then(props.onSuccess) /* 4 */
  }
}
```

ctrl.code is our view-model. This will hold what the user has typed in.
This is the function that will run when the user submits the coupon code form (you'll see the form in the next subsection).
validateCoupon is the function that validates the user's coupon code against the server via AJAX. However, in our case this function will mock the AJAX request instead of hitting a real server. We will see the implementation of this function soon.
Another thing we expect validateCoupon to do is return a promise-like object. Here we take advantage by telling the promise to run props.onSuccess after it resolves.

> Note that props.onSuccess will come from the parent component. Because of this, we can say Coupon is a callback-style component.

Now let's look at the implementation of validateCoupon:

```javascript
// src/components/coupon/coupon.js
function validateCoupon (code) {  
  var isValid = (code === 'happy') /* 1 */
  var discount = 0.20
  // Mock AJAX promise
  var deferred = mag.deferred() /* 2 */
  if (isValid) { deferred.resolve(discount) }
  else         { deferred.reject('invalid_code') }
  return deferred.promise /* 3 */
}
```

As you can see, we hardcode the validation in the first line of this function. In a real application, this logic (and the discount amount) would be hidden on the server.

Here we are mocking an AJAX request in promise form using m.deferred. If the coupon is valid, we resolve with the discount amount. If not, we reject with an error message. The key point to mocking is to resolve and reject values that would normally come from a server.

Finally, we return the promise so that other code (such as the Coupon controller) can call .then() as necessary.

In general, mocking allows us to simulate an AJAX request without actually touching a server. This allows us to continue developing as if we did have a server, postponing the work of writing one until later.

##II. The Coupon View

As it turns out, the view is quite straightforward:

```javascript
// coupon.js
Coupon.view = function (ctrl) {  
 ctrl.form = {
    _onsubmit: ctrl.onSubmit
  }

  ctrl.errorcode = ctrl.error() ? "Invalid coupon." : ''

  ctrl.coupon = {
    _value: ctrl.code(),
    _onchange: mag.withProp('value', ctrl.code)
  }
}
```

The one new thing we haven't seen before is binding a controller action to a form submit event. Assigning ctrl.submit to onsubmit: will run ctrl.submit when the user submits this form.

By the time the user submits, ctrl.code will contain the user's input due to the two-way data binding between it and the input field.

##III. Including Coupon in VolunteerForm

Revisiting the VolunteerForm view, we can now nest the Coupon component:

```javascript
// volunteer-form.js
VolunteerForm.view = function(ctrl) {
  ctrl['volunteer-form'] = {
    'h3': 'Please enter your contact information:'
  }
  ctrl.listcontacts = mag.module('contacts', Contacts, {
    contacts: ctrl.contacts
  })

  mag.module('total', Total, {
    count: ctrl.contacts().length,
    discount: ctrl.discount()
  })

  mag.module('coupon', Coupon, {
    onSuccess: ctrl.discount
  })

}
```

More excitement! The onSuccess callback we pass to Coupon is the ctrl.discount mag.prop. This means the Coupon controller code validateCoupon.then(options.onSuccess) will feed the discount amount directly into this mag.prop, and thus gracefully and indirectly update the shown total amount in the Total view!

Remember that the result of calling mag.prop() is a getter-setter function. In the above code, we take advantage of this by using the setter part of the function as the onSuccess callback.

If you're coding along, refresh the page and take note of the total. Enter happy into the coupon code form and click the button. The total changed! Try adding and removing attendees. The discount still applies! :D

##IV. Error handling for invalid coupons

The happy path works perfectly. However, we still need to give visual feedback when the user types in an invalid code. Fortunately, MagJS's controller+view combo makes this easy.

Let's go back to the Coupon controller and add a dash of code:

```javascript
Coupon.controller = function (options) {  
  var ctrl = this
  ctrl.code = mag.prop('')
  ctrl.error = mag.prop(null) /* 1 */

  ctrl.onSubmit = function (e) {
    e.preventDefault()
    ctrl.error(null) /* 2 */
    validateCoupon(ctrl.code())
      .then(options.onSuccess, ctrl.error) /* 3 */
  }
}
```

This is another mag.prop — it's the spot we will store any error we might get from the [mocked] server. The view will use this mag.prop to determine whether or not to display error information. Note how we initialize with null, indicating that we begin with no error.

On submit, we always clear the error. This will hide any previous error message that might be on the page.

Here we added ctrl.error as a parameter to .then(). As it turns out, .then() can take two parameters: a success callback, and a failure callback. In this case, any reject error value from validateCoupon will feed directly into our ctrl.error mag.prop.

That wasn't so bad. Now let's revisit the Coupon view:

```javascript
Coupon.view = function (ctrl) {  
  ctrl.form = {
    _onsubmit: ctrl.onSubmit
  }

  ctrl.errorcode = ctrl.error() ? "Invalid coupon." : ''
    /* [clipped] */
  ])
}
```

Do you see the ternary? The pattern condition ? [content] : '' is a good practice for showing/hiding content based on state. There are several advantages to doing it this way: the conditional comes first, the content array can contain multiple elements, and moving the pattern block up/down won't cause any comma-related syntax errors.


If you're coding along, refresh the page, type in an invalid coupon code, and submit. See the error message? Now try submitting happy. Cool! Not only does the discount apply, but the error message also disappears :)

##V. Showing the discounted amount

The last thing we will do (in part 2) is show the user how much money they're "saving" with their coupon. Intuitively, we will do this in the Total component's view. In fact, we won't have to touch the Coupon component at all :)

Let's revisit the Total component view:

```javascript
/* 1 */
Total.calcDiscount = function (discount, count) {  
  var total = count * Total.pricePerCount
  return roundCents(total * discount)
}

Total.view = function(ctrl, props) {
 var total = Total.calcPrice(props.discount, props.count)
  var discountedAmount = Total.calcDiscount(props.discount, props.count)

  ctrl.span = props.discount > 0 ? "(Coupon discount: -$" + discountedAmount + ")" : ''
    ctrl.b = "$" + total
}
```

Only two points this time:

Here we create another model-level method to avoid hardcoding any business logic in our view.

Here is where we show the discounted amount, but only if a discount is present. Again we make use of the pattern condition ? [content] : ''

> You may have noticed there is some duplicate logic between `calcPrice` and `calcDiscount`. In a real app, you can avoid this duplication by creating a helper method for calculating a total without discount.

If you're coding along, refresh the page and enter happy as a coupon code. You should now see the discounted amount appear after validation :)

##Conclusion

We have written four components in a top-down component architecture. VolunteerForm is a parent component that has three child components:

Contacts, a mutative component. It receives an m.prop containing an array of contacts from its parent.
Total, a stateless component. It displays the total price information and has no controller.
Coupon, a callback component. It handles validation and runs a parent-provided callback when validation passes.
VolunteerForm is also the top-level component. It is the component that holds all the important model data, and passes it down to its children as needed.

At the end of the day, MagJS's component features gives us a lot of flexibility for organizing and gluing together our code. Used properly, we can achieve succinct code that is easy to reason about, yet still accomplishes a great deal of functionality.

In part 3 (not yet released), we will handle submission and validation of the entire form, as well as handle some new user stories that involve changing the UX. Until next time!

##Further Reading

[MagJS's Components documentation](https://github.com/magnumjs/mag.js/blob/master/examples/components/README.md)

http://www.sitepoint.com/functional-programming-pure-functions/
