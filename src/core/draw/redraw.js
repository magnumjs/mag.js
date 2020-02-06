import {items, scheduleFlush} from "../../utils"
import {isValidId, clear, runningViewInstance} from "../../module"
import {configs} from "../fill/common"
import makeRedrawFun from "./makeRedrawFun"

const pendingRequests = [];


// var timers = [];
const redraw = function(node, idInstance, force) {
    if (!pendingRequests[idInstance]) {
        if (!node || typeof idInstance == 'undefined') {
            throw Error(
                'Mag.JS - Id or node invalid: ' + items.getItemVal(idInstance)
            );
        }

        // verify idInstance
        if (!isValidId(node.id, idInstance)) {
            // reschedule?
            return {
                then: cb => cb()
            };
        }

        // clear existing configs ?
        // TODO: per idInstance / id ?
        if (force) configs.splice(0, configs.length);

        if (force) clear(idInstance);

        if (runningViewInstance == idInstance) {
            throw Error('Mag.JS - recursive call:' + idInstance);
        }

        // check for existing frame id then clear it if exists
        //ENQUEUE
        //debounce

        // console.time(node.id)
        //returns promise
        return scheduleFlush(
            idInstance,
            makeRedrawFun(node, idInstance, force)
        );
        // .then(() => console.timeEnd(node.id))
        //save frame id with the instance
        // then if instance already has frame id create new discard old or just retain old
    }
}
export {pendingRequests}
export default redraw
