##Application architecture with components

Components are versatile tools to organize code and can be used in a variety of ways.

###Want to skip all this and just see the source?
[JSBIn example](http://jsbin.com/luhipixipe/edit)

First we have our html that we will be using:

```html
<div id="contacts">
  <h2>Contacts</h2>
  <addForm>
    <div id="form" class="hide">
      <form>
        <input name="name" />
        <input name="email" />
        <input type="submit" />
      </form>
    </div>
  </addForm>
  <list>
    <ul id="items" class="hide">
      <li class="contact">
        <span class="name"></span> - 
        (<id></id>: <span class="email"></span>)
      </li>
    </ul>
  </list>
</div>
```

##Model/services

Now let's create a simple model entity which we'll use in our simple application, to illustrate different usage patterns for components:


```javascript
var Contact = function(data) {
    data = data || {}
    this.id = mag.prop(data.id)
    this.name = mag.prop(data.name)
    this.email = mag.prop(data.email)
}
Contact.list = function(data) {
    return mag.addons.request({method: "GET", url: "/api/contact", type: Contact})
}
Contact.save = function(data) {
    return mag.addons.request({method: "POST", url: "/api/contact", data: data})
}
```

Here, we've defined a class called Contact. A contact has an id, a name and an email. There are two static methods: list for retrieving a list of contacts, and save to save a single contact. These methods assume that the AJAX responses return contacts in JSON format, containing the same fields as the class.

##Aggregation of responsibility

One way of organizing components is to use component parameter lists to send data downstream, and to define events to bubble data back upstream to a centralized module who is responsible for interfacing with the model layer.

##Container component

This is the parent component, it houses all inner components.

```javascript
var ContactsWidget = {
  controller: function update() {
  
    this.contacts = Contact.list(update.bind(this))

    this.handleContactSubmit = function(contact) {
        Contact.save(contact).then(update.bind(this))
    }.bind(this)
    
  },
  view: function(state) {
    
    state.addForm = mag.module('form', contactForm, {
      onContactSubmit: state.handleContactSubmit,
    })

    state.list = mag.module('items', ContactList, {
      contacts: state.contacts
    })
    
  }
}
```

##Form module
This is our first inner component, the contact form.

The ContactForm component is, as its name suggests, a form that allows us to edit the fields of a Contact entity. It exposes an event called onsave which is fired when the Save button is pressed on the form. In addition, it stores the unsaved contact entity internally within the component (this.contact = mag.prop(props.contact || new Contact())).

```javascript
var ContactForm = {
  controller: function(props) {
      this.contact = mag.prop(args.contact || new Contact())
  },
  view: function(state, props) {
    var contact = ctrl.contact()

    // create an object to bind our instructions for our html fields
    state.form = Object.keys(contact).reduce(function(previous, current) {

      previous[current] = {
        _onchange: mag.withProp("value", contact[current]),
        _value: contact[current](),
        _config: function(node, isNew) {
          // change html value
          node.value = contact[current]()
        }
      }

      return previous;
    }, {});

    // handle form submit
    state.form._onsubmit = function(e) {
      // prevent default browser form submti behavior
      e.preventDefault()
      if (contact.name() && contact.email()) {
        props.onContactSubmit(contact)
      }
    }
  }
}
```
##List module

This is our second inner componenet and sibling to the contact form.

The ContactList component displays a table showing all the contact entities that are passed to it via the contacts properties.

```javascript
var ContactList = {
  view: function(state, props) {
    state.contact = props.contacts
  }
}
```

Now let's start the applicaton by attaching it the our html element

```javascript
//Initialize the application
mag.module('contacts', ContactsWidget)
```

In the example above, there are 3 components. ContactsWidget is the top level module being rendered to its associated element, and it is the module that has the responsibility of talking to our Model entity Contact, which we defined earlier.


The most interesting component is ContactsWidget:

* on initialization, it fetches the list of contacts (this.contacts = Contact.list)

* when save is called, it saves a contact (Contact.save(contact))

* after saving the contact, it reloads the list (.then(update.bind(this)))

update is the controller function itself, so defining it as a promise callback simply means that the controller is re-initialized after the previous asynchronous operation (Contact.save())

Aggregating responsibility in a top-level component allows the developer to manage multiple model entities easily: any given AJAX request only needs to be performed once regardless of how many components need its data, and refreshing the data set is simple.

In addition, components can be reused in different contexts. Notice that the ContactList does not care about whether args.contacts refers to all the contacts in the database, or just contacts that match some criteria. Similarly, ContactForm can be used to both create new contacts as well as edit existing ones. The implications of saving are left to the parent component to handle.

This architecture can yield highly flexible and reusable code, but flexibility can also increase the cognitive load of the system (for example, you need to look at both the top-level module and ContactList in order to know what is the data being displayed (and how it's being filtered, etc). In addition, having a deeply nested tree of components can result in a lot of intermediate "pass-through" arguments and event handlers.

[JSBin example](http://jsbin.com/luhipixipe/edit)
