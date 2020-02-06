import {getMod, getProps} from "./module"
import {rafBounceIds, rafBounce, rafRate} from './core/constants'

const utils = {};
let runningEventInstance

//rAF:
var queue = [],
  scheduled = [],
  scheduler,
  prev = [];

const scheduleFlush = function(id, fun) {
  return new Promise(function(resolve) {
    if (rafBounce || (rafBounceIds[id] && fun)) {
      if (scheduled[id]) {
        prev[id]();
        cancelAnimationFrame(scheduled[id]);
      }
      prev[id] = resolve;
      scheduled[id] = requestAnimationFrame(start => {
        scheduled[id] = 0;
        fun();
        resolve();
      });
    } else {
      if (fun) queue.push(fun);
      if (!scheduler)
        scheduler = requestAnimationFrame(start =>
          processTaskList(resolve, start, id)
        );
    }
  });
};

function checkRate(finish, start) {
  if (rafRate) {
    return finish - start < rafRate;
  }
  return true;
}

function processTaskList(resolve, taskStartTime, id) {
  var taskFinishTime;
  scheduler = 0;

  do {
    // Assume the next task is pushed onto a stack.
    var nextTask = queue.shift();

    // Process nextTask.
    if (nextTask) nextTask();

    // Go again if there’s enough time to do the next task.
    taskFinishTime = performance.now();
  } while (queue.length && checkRate(taskFinishTime, taskStartTime));

  if (queue.length) {
    scheduleFlush(id).then(resolve);
  } else {
    resolve();
  }
}

//Collection:
var items = {
  i: [],
  isItem: id => ~items.i.indexOf(id),
  setItem: id => (items.i[items.i.length] = id),
  getItem: id => items.i.indexOf(id),
  getItemVal: index => items.i[index],
  removeItem: id => items.i.splice(items.i.indexOf(id), 1)
};

utils.items = items;

utils.getItemInstanceIdAll = () => items.i;

const getItemInstanceId = id => {
  if (items.isItem(id)) {
    return items.getItem(id);
  } else {
      items.setItem(id);
    return items.getItem(id);
  }
};



export default utils;


export {
    getItemInstanceId,
    scheduleFlush,
    runningEventInstance,
    items
}