Application architecture with components

Components are versatile tools to organize code and can be used in a variety of ways.

Let's create a simple model entity which we'll use in a simple application, to illustrate different usage patterns for components:

var Contact = function(data) {
    data = data || {}
    this.id = m.prop(data.id)
    this.name = m.prop(data.name)
    this.email = m.prop(data.email)
}
Contact.list = function(data) {
    return m.request({method: "GET", url: "/api/contact", type: Contact})
}
Contact.save = function(data) {
    return m.request({method: "POST", url: "/api/contact", data: data})
}
Here, we've defined a class called Contact. A contact has an id, a name and an email. There are two static methods: list for retrieving a list of contacts, and save to save a single contact. These methods assume that the AJAX responses return contacts in JSON format, containing the same fields as the class.

Aggregation of responsibility

One way of organizing components is to use component parameter lists to send data downstream, and to define events to bubble data back upstream to a centralized module who is responsible for interfacing with the model layer.

var ContactsWidget = {
    controller: function update() {
        this.contacts = Contact.list()
        this.save = function(contact) {
            Contact.save(contact).then(update.bind(this))
        }.bind(this)
    },
    view: function(ctrl) {
        return [
            m.component(ContactForm, {onsave: ctrl.save}),
            m.component(ContactList, {contacts: ctrl.contacts})
        ]
    }
}

var ContactForm = {
    controller: function(args) {
        this.contact = m.prop(args.contact || new Contact())
    },
    view: function(ctrl, args) {
        var contact = ctrl.contact()

        return m("form", [
            m("label", "Name"),
            m("input", {oninput: m.withAttr("value", contact.name), value: contact.name()}),

            m("label", "Email"),
            m("input", {oninput: m.withAttr("value", contact.email), value: contact.email()}),

            m("button[type=button]", {onclick: args.onsave.bind(this, contact)}, "Save")
        ])
    }
}

var ContactList = {
    view: function(ctrl, args) {
        return m("table", [
            args.contacts().map(function(contact) {
                return m("tr", [
                    m("td", contact.id()),
                    m("td", contact.name()),
                    m("td", contact.email())
                ])
            })
        ])
    }
}

m.mount(document.body, ContactsWidget)
In the example above, there are 3 components. ContactsWidget is the top level module being rendered to document.body, and it is the module that has the responsibility of talking to our Model entity Contact, which we defined earlier.

The ContactForm component is, as its name suggests, a form that allows us to edit the fields of a Contact entity. It exposes an event called onsave which is fired when the Save button is pressed on the form. In addition, it stores the unsaved contact entity internally within the component (this.contact = m.prop(args.contact || new Contact())).

The ContactList component displays a table showing all the contact entities that are passed to it via the contacts argument.

The most interesting component is ContactsWidget:

on initialization, it fetches the list of contacts (this.contacts = Contact.list)

when save is called, it saves a contact (Contact.save(contact))

after saving the contact, it reloads the list (.then(update.bind(this)))

update is the controller function itself, so defining it as a promise callback simply means that the controller is re-initialized after the previous asynchronous operation (Contact.save())

Aggregating responsibility in a top-level component allows the developer to manage multiple model entities easily: any given AJAX request only needs to be performed once regardless of how many components need its data, and refreshing the data set is simple.

In addition, components can be reused in different contexts. Notice that the ContactList does not care about whether args.contacts refers to all the contacts in the database, or just contacts that match some criteria. Similarly, ContactForm can be used to both create new contacts as well as edit existing ones. The implications of saving are left to the parent component to handle.

This architecture can yield highly flexible and reusable code, but flexibility can also increase the cognitive load of the system (for example, you need to look at both the top-level module and ContactList in order to know what is the data being displayed (and how it's being filtered, etc). In addition, having a deeply nested tree of components can result in a lot of intermediate "pass-through" arguments and event handlers.
