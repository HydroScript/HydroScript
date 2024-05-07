"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function format_parsing_error(expected, got, line, token) {
    return "".concat(line ? "Line ".concat(line, ": ") : "", "Expected ").concat(typeof expected == "object" ?
        expected.join(" or ") :
        expected, ", got ").concat(got).concat(token ? " (".concat(JSON.stringify(token), ")") : "");
}
exports.default = format_parsing_error;
