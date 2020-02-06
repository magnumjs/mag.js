import mag from "./mag"
import {getProps, getState} from "../module"
import {isHTMLEle, merge, copy} from "./utils/common"
import {getItemInstanceId, items} from "../utils"
import run from "./draw/run"
import {rafBounceIds} from './constants';

const clones = [], cloners = {};
let inc = 0;

const makeClone = function(idInstance, node, module, props) {
    // recursion warning
    clones[idInstance] = clones[idInstance] || [];
    var a = function(ids, node, module, props2, index) {
        //TODO: what is this use case? if no index?
        if (typeof index == 'object') {
            props2 = merge(copy(props2), index);
            index = 0;
        }

        if (ids < 0 && !index) {
            index = 1;
        }

        // prevent recursion?
        var id =
            node.id + (props2.key ? '.' + props2.key + '.' : '') + (index || '');

        //TODO: add key when props key not used?
        if (cloners[id] && !props2.key && !~a._id) {
            id += ++inc;
        }

        var cloner = (cloners[id] = cloners[id] || node.cloneNode(1));
        cloner.id = id;
        // if clone already exists return & rerun draw ?
        if (items.isItem(id)) {
            // call redraw on
            // get unique instance ID's module
            run(cloner, id, props2, module);
            return cloner;
        }

        var idInstance2 = getItemInstanceId(cloner.id);
        if (ids < 0) {
            //call will and did load events
            ids = a._id = idInstance2;
            // repeated similar clones?
            // Check if instanceId in clones already?
        } else {
            clones[ids].push({
                instanceId: idInstance2,
                //id: cloner.id, // TODO: remove, use mag.getId(instanceId)
                subscribe: subscriberHandler.bind({}, idInstance2)
            });
        }

        // get unique instance ID's module
        run(cloner, id, props2, module);
        return cloner;
    }.bind({}, idInstance, node, module, props);

    //BIND CLONE INSTANCE METHODS

    a._id = idInstance;
    a.clones = function() {
        return clones[a._id];
    };

    //TODO: implement
    a.destroy = function(remove) {
        destroyerHandler(a._id, a.clones, remove);
    };
    a.getId = function() {
        return a._id;
    };
    a.rafBounce = function(bounce) {
        if (bounce) {
            //add
            rafBounceIds[a._id] = 1;
        } else if (bounce === false) {
            //remove
            rafBounceIds[a._id] = 0;
        }
        return rafBounceIds[a._id] ? true : false;
    };
    a.draw = function(force) {
        return mag.redraw(node, a._id, force);
    };
    a.getState = function() {
        return getState(a._id);
    };
    a.getProps = function() {
        return getProps(a._id);
    };
    a.subscribe = function(handler) {
        return subscriberHandler(a._id, handler);
    };

    return a;
};


export default makeClone
