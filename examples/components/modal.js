/*
<div id="modalCase">
<div id="modal" class="hide">
  <section class="modal">
    <section class="wrapper">
    </section>
    <button class="close-modal">Close</button>
  </section>
</div>
<button>Open</button>
</div>
*/
var modal = {
  controller: function(props) {
    this.visible = mag.prop(props.visible || false)
  },
  view: function(element, props, state) {
    if (state.visible()) {
      element.classList.remove('hide')
      state.wrapper = {
        _html: props.content()
      }
    } else {
      element.classList.add('hide')
    }
    state.button = {
      _onclick: function() {
        state.visible(false)
      }
    }
  }
}

mag.module('modalCase', {
  view: function(element, props, state) {
    state.button = {
      _onclick: function() {
        state.modal = mag.module('modal', modal, {
          visible: true,
          content: function() {
            return '<b>HTML</b>'
          }
        })
      }
    }
  }
})
