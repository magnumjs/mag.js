import isNode from "../dom/isNode"
import {toJson} from "../utils/common"
import {callLCEvent} from "../utils/events"
import {items} from "../../utils"
import {getState, exists, submodule, setFrameId, getProps} from "../../module"
import redraw from "./redraw"
import getNode from "../dom/getNode"


const run = function(cloner, id, props2, module, clear) {
    var ids = items.getItem(id);
    id = isNode(cloner);

    var prev = toJson(getProps(ids));

    didloader(ids, cloner);

    if (exists(ids)) {
        if (
            callLCEvent(
                'willgetprops',
                getState(ids),
                cloner,
                ids,
                0,
                props2
            )
        )
            return;
    }

    submodule(cloner.id, ids, module, props2)

    //attach props to the clone
    if (prev != toJson(getProps(ids))) {
        clear = 1;
    }

    observer(ids, cloner.id);

    if (willloader(ids, cloner)) return;

    // DRAW, return Promise
    redraw(cloner, ids, clear).then(function() {
        //DIDLOAD?
        didloader(ids, cloner);
    });
};


var willloader = function(idInstance, node) {
    return callLCEvent(
        'willload',
        getState(idInstance),
        node,
        idInstance,
        1
    );
};


var didloader = function(idInstance, node) {
    // only if attached
    var id = items.getItemVal(idInstance);
    if (getNode(id) && exists(idInstance)) {
        return callLCEvent(
            'didload',
            getState(idInstance),
            node,
            idInstance,
            1
        );
    }
};


var observer = function(idInstance, nodeId) {
    var callback = function(index, id) {
        if (getNode(id)) {
            redraw(getNode(id), index);
        } else if (items.isItem(id)) {
            mag.clear(index);
            //throw Error('invalid node id ' + id + ' index ' + index)
        }
    }.bind({}, idInstance, nodeId);
    setFrameId(idInstance, callback);
};

export {observer, willloader, didloader}

export default run