import getNode from "../dom/getNode"
import {isValidId, iscached, callView, getState} from "../../module"
import {callLCEvent} from "../utils/events"
import {setId, getId, configs} from "../fill/common"
import {run} from "../../fill"

const callConfigs = function(id, configs) {
    for (var k in configs) {
        if (k.startsWith('id("' + id + '")/')) {
            configs[k]();
        }
    }
};

const makeRedrawFun = function(node1, idInstance1, force1) {
    return function(node, idInstance, force) {
        // clear node cache new run
        getNode(node.id, 1);

        // verify idInstance
        if (!isValidId(node.id, idInstance) || !node) {
            return;
        }

        var state = getState(idInstance);

        // LIFE CYCLE EVENT
        if (callLCEvent('isupdate', state, node, idInstance)) return;

        // CACHED?
        if (iscached(idInstance) && !force) {
            return 0;
        }

        // LIFE CYCLE EVENT
        if (callLCEvent('willupdate', state, node, idInstance)) return;

        //RUN VIEW FUN
        callView(node, idInstance)

        // var active = mag.doc.activeElement

        //START DOM
        var pfillId = getId();
        setId(node.id);
        run(node, state);
        setId(pfillId);

        // END DOM

        // if (mag.doc.activeElement !== active) active.focus()

        //CONFIGS
        callConfigs(node.id, configs);

        // LIFE CYCLE EVENT
        callLCEvent('didupdate', state, node, idInstance);

        //reset cache
        if (!force) iscached(idInstance);
    }.bind({}, node1, idInstance1, force1);
}

export default makeRedrawFun