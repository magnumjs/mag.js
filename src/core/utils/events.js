import {setRunningEventInstance} from '../constants';


//Events:
const handlers = [];
const onLCEvent = function(eventName, index, handler) {
    var eventer = eventName + '-' + index;
    handlers[eventer] = handlers[eventer] || [];
    handlers[eventer].push(handler);
    //Remove self:
    return function() {
        const index = handlers[eventer].indexOf(handler);
        return handlers[eventer].splice(index, 1);
    };
};

const callLCEvent = function(eventName, controller, node, index, once, extra) {
    var isPrevented;
    setRunningEventInstance(index);
    var props// = getProps(index);
    var instance// = getMod(index);

    var event =
        (instance && instance[eventName]) || (controller && controller[eventName]);
    if (event && !event.called) {
        isPrevented = event.call(instance, node, props, index, extra);
        if (once) event.called = 1;
    }

    // on Handlers
    var eventer = eventName + '-' + index;
    if (handlers[eventer]) {
        const handlersCopy = handlers[eventer].slice();
        for (var handle of handlersCopy) {
            handle(controller, props, node);
        }
    }

    setRunningEventInstance(-1);
    if (isPrevented === false) return true;
};

export {onLCEvent, callLCEvent}
