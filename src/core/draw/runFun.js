import mag from '../mag-stateless';
import {MAGNUM, _cprops, doc} from '../constants';
import {getId, setId, run} from '../../fill-stateless';
import {callLCEvent} from '../utils/events';
import {copy, extend, isObject, isUndefined} from '../utils/common';

let inc = 0;
var runFun = function(idOrNode, mod, dprops, fake) {
  var clones = [],
    clone = idOrNode.cloneNode(1),
    runId,
    copyOfDefProps = [];

  var a = function(props) {
    var node = idOrNode;
    props = props || {};

    //TODO: Auto-generate keys when not defined?

    var key;
    if (!isUndefined(props.key)) key = props.key + '-' + a.id;
    var ckey = !isUndefined(props.key) ? props.key + '-' + a.id : a.id;

    if (!copyOfDefProps[ckey]) {
      copyOfDefProps[ckey] = isObject(dprops) ? copy(dprops) : dprops;
    }

    // retrieve props & merge
    if (isObject(props)) {
      props = extend(copyOfDefProps[ckey], props);
    }

    if (key && !clones[key]) {
      node = clones[key] = clone.cloneNode(1);
    } else if (key && clones[key]) {
      node = clones[key];
    }

    if (!isUndefined(a) && props && props.key && a.key && a.key != ckey) {
      callLCEvent('onunload', props, node, a.key);
    }

    //Block recursivity
    if (runId && runId == node[MAGNUM].scid) {
      throw Error('MagJS Error - recursive call:' + runId);
    }

    node[MAGNUM] = node[MAGNUM] || {};
    //TODO: copy props to NODE? for children
    node[MAGNUM].props = copy(props);
    if (mag._cprops[ckey] && isObject(props)) {
      props.children = _cprops[ckey];
    }

    a.props = props;
    a.key = ckey;
    a.fake = fake;
    var now;
    try {
      var _current = mag._current;
      mag._current = a;
      if (!mag._active || doc.activeElement !== mag._active) {
        mag._active = doc.activeElement;
      }
      if (
        mag._active &&
        mag._activePosition !== doc.activeElement.selectionStart
      ) {
        mag._activePosition = doc.activeElement.selectionStart;
      }

      now = mod(props);
      runId = node[MAGNUM].scid = ckey;
      //NEED? previous props?
      var pfillId = getId();
      //TODO: find parent
      if (pfillId && pfillId[MAGNUM] && pfillId[MAGNUM].scid) {
        node[MAGNUM].pscid = pfillId[MAGNUM].scid;
      }
      setId(node);
      run(node, now);
    } finally {
      //replace fragment html
      var frag = node.querySelector('fragment');
      //FASTER?
      if (frag && !fake) frag.replaceWith(...frag.childNodes);

      callLCEvent('didupdate', props, node, ckey);
      setId(pfillId);
      runId = 0;
      mag._current = _current;
      if (mag._active && doc.activeElement !== mag._active) {
        mag._active.focus();
        mag._active.setSelectionRange(mag._activePosition, mag._activePosition);
        //console.log(mag._active[MAGNUM], node)
        //search ?
      }
    }

    return node;
  };
  a.id = ++inc;
  a.element = clone;

  return a;
};

export default runFun;
