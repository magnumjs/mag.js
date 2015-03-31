var Contact = function(data) {
  data = data || {}
  this.id = mag.prop(data.id)
  this.name = mag.prop(data.name)
  this.email = mag.prop(data.email)
}

var a = []
Contact.list = function(cb) {
  //async results

  var timer = setTimeout(function() {

    // a = [{
    //   id: 1,
    //   name: 'test'
    // }, {
    //   id: 2,
    //   name: 'test2'
    // }]

    a = JSON.parse(localStorage['contacts'] || '[]')
    cb()

  }, 1000)

  return a
}

Contact.save = function(data, cb) {

  // save in localStorage
  // add to current
  setTimeout(function() {

    var contacts = JSON.parse(localStorage['contacts'] || '[]')

    contacts.push({
      id: 1,
      name: data.name(),
      email: data.email()
    })

    localStorage['contacts'] = JSON.stringify(contacts)

    cb()
  }, 100)
}

var ContactsWidget = {
  controller: function update(props) {

    this.contacts = Contact.list(update.bind(this))

    this.save = function(contact) {
      Contact.save(contact, update.bind(this))
    }.bind(this)

    this.onload = function(element) {
      console.log('contacts onload')
      element.querySelector('#list').classList.remove('hide')
    }

  },
  view: function(element, props, state) {

    state.form = mag.module('form', ContactForm, {
      onsave: state.save
    })

    state.ul = mag.module('list', ContactList, {
      contacts: state.contacts
    })

  }
}


var ContactForm = {
  controller: function(props) {
    this.contact = mag.prop(props.contact || new Contact())
  },
  view: function(element, props, state) {
    var contact = state.contact()

    state.name = {
      _oninput: mag.withProp("value", contact.name),
      value: contact.name()
    }

    state.email = {
      _oninput: mag.withProp("value", contact.email),
      value: contact.email()
    }
    state.button = {
      _onclick: props.onsave.bind(this, contact)
    }
  }
}

var ContactList = {
  view: function(element, props, state) {
    state.contact = props.contacts
  }
}

document.body.querySelector('#contacts').classList.remove('hide')
// mag.logger(console)
mag.module('contacts', ContactsWidget)
