"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get_item(list, key) {
    var _a;
    var kc = ((key.startsWith("\"") && key.endsWith("\"")) || (key.startsWith("'") && key.endsWith("'"))) ? key : "\"".concat(key, "\"");
    return ((_a = list.filter(function (item) { return item.key == kc; })[0]) !== null && _a !== void 0 ? _a : { value: null }).value;
}
exports.default = get_item;
