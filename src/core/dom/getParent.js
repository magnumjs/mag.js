import getNode from "./getNode"
import {items} from "../../utils"

const getParent = function(instanceID) {
    var parentID = items.getItemVal(instanceID);
    var parentNode = getNode(parentID);
    return parentNode;
};


export default getParent