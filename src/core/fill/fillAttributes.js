import {getPathIndex, cached,getPathTo, getUid,getHook, setHtml, setText} from "./common"
import {makeEvent} from "./events";
import {isArray} from "../utils/common"


const hook = getHook()
// fill in the attributes on an element (setting text and html first)
export default function fillAttributes(node, attributes, p, parentKey) {
    var tagIndex = getPathIndex(p);

    cached[getUid(node)] = cached[getUid(node)] || [];

    // set the rest of the attributes
    for (var attrName in attributes) {
        // skip text and html, they've already been set
        if (attrName === 'text' || attrName === 'html') continue;

        // events
        if (attrName.indexOf('on') == 0) {
            makeEvent(attributes[attrName], attrName, node, parentKey);
            // node[attrName.toLowerCase()] = createEventCall(node, attributes[attrName], attrName)
        } else {
            if (attrName == 'config') {
                //TODO: Why not cache xpath?
                var p = getPathTo(node),
                    tagIndex = getPathIndex(p);

                // have we been here before?
                // does the element already exist in cache
                // useful to know if this is newly added

                var isNew = true;

                if (!cached[p + '-config']) {
                    cached[p + '-config'] = {};
                } else {
                    isNew = false;
                }

                var context = (cached[p + '-config'].configContext =
                    cached[p + '-config'].configContext || {});

                // bind
                var callback = function(data, args) {
                    return function() {
                        return data.apply(data, args);
                    };
                };
                configs[p] = callback(attributes[attrName], [
                    node,
                    isNew,
                    context,
                    tagIndex
                ]);
                continue;
            }

            if(hook) {
                // hookins
                var data = {
                    key: attrName,
                    value: attributes[attrName],
                    node: node
                };
                hook('attributes', attrName, data);

                //   // change
                if (data.change) {
                    attrName = data.key;
                    attributes[attrName] = data.value;
                }
            }
            // cache atrtibutes and compare
            if (
                cached[getUid(node)] &&
                cached[getUid(node)][attrName] == attributes[attrName]
            )
                continue;

            if (attributes[attrName] === null) {
                // remove property too or just attribute?
                node.removeAttribute(attrName);
            } else {
                if (
                    attrName == 'value' &&
                    node.multiple &&
                    node.selectedOptions &&
                    isArray(attributes[attrName])
                ) {
                    //TODO: case multiple select
                    node.value = attributes[attrName];

                    attributes[attrName].forEach(function(v) {
                        Array.from(node.options).find(c => c.value == v).selected = true;
                    });
                }
                // separate property vs attribute?
                else if (attrName in node) {
                    if (attrName == 'style')
                        node[attrName].cssText = attributes[attrName];
                    else node[attrName] = attributes[attrName];
                } else {
                    node.setAttribute(attrName, String(attributes[attrName]));
                }
            }
            cached[getUid(node)][attrName] = attributes[attrName];
        }
    }

    // set html after setting text because html overrides text
    setText(node, attributes.text);
    setHtml(node, attributes.html);
}