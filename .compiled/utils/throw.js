"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throw_error(error) {
    var _a;
    throw ((_a = error._display) !== null && _a !== void 0 ? _a : error.toString());
}
exports.default = throw_error;
