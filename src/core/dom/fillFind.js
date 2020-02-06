import {setId, getId, matchingElements} from "../../fill"

const fillFind = function(element, key) {
    var pfillId = getId();
    setId(element);
    // only for user input fields
    var found = matchingElements(element, key);
    setId(pfillId);

    return found;
}

export default fillFind