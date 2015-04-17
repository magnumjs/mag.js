/*
<div id="modalCase">
  <h3>Modal example.. <span data-bind="selected"/></h3>
  <div id="modal" class="hide">
    <section class="modal">
      <section class="wrapper">
        <div id="select">
          <select>
            <option></option>
          </select>
        </div>
      </section>
      <button class="close-modal">Close</button>
    </section>
  </div>
  <button>Open</button>
</div>
*/

var modal = {
  controller: function(props) {
    this.visible = mag.prop(props.visible)
    this.binds = props.binds || mag.prop()
  },
  view: function(element, props, state) {
    if (state.visible()) {
      element.classList.remove('hide')
      state.wrapper = props.content()
    } else {
      element.classList.add('hide')
    }
    state.button = {
      _onclick: function() {
        state.visible(false)
        state.binds()
      }
    }
  }
}

var select = {
  view: function(element, props, state) {
    state.select = {
      _onchange: mag.withProp('value', props.setter)
    }
    state.option = props.list.map(function(item) {
      var data = {
        _text: item
      }
      item == props.selected && (data._selected = true)
      return data
    })
  }
}

var props = {
  selected: 'second'
}

mag.module('modalCase', {
  controller: function(props) {
    this.setter = mag.prop(props.selected || '')
  },
  view: function(element, props, state) {
    state.button = {
      _onclick: modalee.bind(this, state)
    }
  }
}, props)

var modalee = function(state) {
  mag.module('modal', modal, {
    binds: function() {
      state.selected = 'selected:' + state.setter()
    },
    visible: true,
    content: function() {
      mag.module('select', select, {
        list: ['first', 'second', 'third'],
        selected: state.setter(),
        setter: state.setter
      })
    }
  })
}
