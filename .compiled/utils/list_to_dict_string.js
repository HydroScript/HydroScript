"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function list_to_dict_string(list, value_func) {
    if (!list[0])
        return "{}";
    var items = list.map(function (_a) {
        var key = _a.key, value = _a.value;
        return "".concat(key, ": ").concat(value_func(value));
    });
    return "{ ".concat(items.join(", "), " }");
}
exports.default = list_to_dict_string;
