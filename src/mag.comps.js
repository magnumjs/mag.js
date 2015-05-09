/*
Mag.JS Components v0.1
(c) Michael Glazer
https://github.com/magnumjs/mag.js
*/

mag.comps ={}

/*
<div id="passFail">
  <message/>
</div>
*/

mag.comps.passFail = {}

mag.comps.passFail.view = function(state, props) {

  state.message = props.pass() ? props.message.pass : props.fail() ? props.message.fail : ""

  state._class = props.pass() ? 'success' : props.fail() ? 'error' : ''

  state.messaging = state.message
}
