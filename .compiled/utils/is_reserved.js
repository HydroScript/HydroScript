"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_suffix = exports.is_reserved = void 0;
var js_reserved_1 = require("../data/js_reserved");
var hys_reserved_1 = require("../data/hys_reserved");
var Reserved = Object.assign({}, js_reserved_1.default, hys_reserved_1.default);
function is_reserved(str) {
    for (var reserved_1 in Reserved)
        if (str == reserved_1 || str.startsWith("".concat(reserved_1, "_1")))
            return true;
    return false;
}
exports.is_reserved = is_reserved;
function add_suffix(str) {
    return "".concat(str).concat(is_reserved(str) ? "_1" : "");
}
exports.add_suffix = add_suffix;
