"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function remove_quotations(value) {
    var _a;
    var string = value.split("");
    var mark = string.shift();
    var text = "";
    while (string[0] && string[0] != mark) {
        var current = string.shift();
        if (current == "\\")
            text += "\\".concat((_a = string.shift()) !== null && _a !== void 0 ? _a : "");
        else
            text += current;
    }
    return [text, mark];
}
exports.default = remove_quotations;
