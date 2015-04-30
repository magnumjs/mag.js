var ContactsWidget = {
  controller: function update(props) {

    this.contacts = Contact.list(update.bind(this))

    this.save = function(contact) {
      this.contacts = Contact.save(contact, update.bind(this))
    }.bind(this)

    this.didload = function(e,element) {
      document.body.querySelector('#contacts').classList.remove('hide')
      localStorage.removeItem('contacts')
      element.querySelector('#list').classList.remove('hide')
    }

  },
  view: function(state, props, element) {

    state.h2 = 'Contacts'

    mag.module('form', ContactForm, {
      onsave: state.save
    })

    mag.module('list', ContactList, {
      contacts: state.contacts
    })

  }
}

var guid = -1
var ContactForm = {
  controller: function(props) {
    this.contact = mag.prop(props.contact || new Contact({
      id: guid++
    }))
    this.onunload = function(e) {
      //console.log('ContactForm unloaded')
      //e.preventDefault()
    }
  },
  view: function(state, props, element) {
    var contact = state.contact()
    // better to event delegate redundancies higher up
    state.name = {
      _onblur: mag.withProp("value", contact.name),
      value: contact.name()
    }

    state.email = {
      _onblur: mag.withProp("value", contact.email),
      value: contact.email()
    }
    state.button = {
      _onclick: props.onsave.bind(this, contact)
    }
  }
}

var ContactList = {
  view: function(state, props, element) {
    state.contact = props.contacts
  }
}

var Contact = function(data) {
  data = data || {}
  this.id = mag.prop(data.id)
  this.name = mag.prop(data.name)
  this.email = mag.prop(data.email)
}

var a = [],
  called = false;

Contact.list = function(cb) {
  //async results
  if (!called) {
    setTimeout(function() {
      a = JSON.parse(localStorage['contacts'] || '[]')
      called = true
      cb()
    }, 1000)
  }
  return a
}

Contact.save = function(data, cb) {

  var contacts = a = JSON.parse(localStorage['contacts'] || '[]')

  contacts.push({
    id: data.id(),
    name: data.name(),
    email: data.email()
  })

  setTimeout(function() {
    localStorage['contacts'] = JSON.stringify(contacts)
    called = false
    cb()
  }, 100)
  // return temp for faster re-render
  return contacts
}

mag.module('contacts', ContactsWidget)
