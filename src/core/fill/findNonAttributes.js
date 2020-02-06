import {ignorekeys} from '../../core/constants'
import {matchingElements} from "./matches"
import {getHook} from "./common"
import run from "./run"

const hook = getHook()


export default function findNonAttributes(node, data, p) {
    var elements;

    for (var key in data) {
        var value = data[key];

        // ignore certain system keys
        if (~ignorekeys.indexOf(key)) continue;

        // only attributes start with an underscore
        if (key[0] !== '_' && key.substr(0, 2) != 'on') {
            elements = matchingElements(node, key);

            if(hook) {
                // hookins
                var data2 = {
                    key: key,
                    value: value,
                    node: node
                };
                hook('values', '*', data2);
                // change
                if (data2.change) {
                    value = data2.value;
                }
            }
            //TODO: what's this use case??
            // if (_isArray(value)) {
            //   elements = matchingElements(node, '$' + key);
            // }

            run(elements, value, p + '/' + key);
        }
    }
}
