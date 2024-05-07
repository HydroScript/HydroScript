"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_type_1 = require("../lexer/token_type");
var internal_1 = require("./internal");
var fs = require("node:fs");
var __1 = require("..");
var process_1 = require("../process");
var HydroScriptSyntaxError = (function (_super) {
    __extends(HydroScriptSyntaxError, _super);
    function HydroScriptSyntaxError(expected, got, path, line, column, process_type) {
        var _this = this;
        var _a;
        var message;
        if (expected == null)
            message = "Unexpected token ".concat((_a = token_type_1.TokenType[got]) !== null && _a !== void 0 ? _a : got, " (").concat(got, ")");
        else if (typeof expected == "number" && typeof got == "number")
            message = "Expected ".concat(token_type_1.TokenType[expected], " (").concat(expected, "), got ").concat(token_type_1.TokenType[got], " (").concat(got, ")");
        else if (typeof expected == "object" && typeof got == "number")
            message = "Expected ".concat(expected.map(function (v) { return token_type_1.TokenType[v]; }).join(" or "), " (").concat(expected.map(function (v) { return String(v); }).join(" or "), "), got ").concat(token_type_1.TokenType[got], " (").concat(got, ")");
        else
            throw new internal_1.default("HydroScriptSyntaxError creation failed: invalid parameters");
        _this = _super.call(this, message) || this;
        _this.name = "HydroScriptSyntaxError";
        _this._path = "<unknown>";
        _this._path = path;
        var stack = [_this.stack.split("\n")[0]];
        if (line) {
            _this._line = line;
            _this._column = column;
            stack.push("    at <unknown> (".concat(_this._path, ":").concat(line, ":").concat(column, ")"));
        }
        if (typeof process_type == "number") {
            var lex_stack = "    at HydroScript.Tokenize (hydroscript\\lexer\\index.js)";
            var parse_stack = "    at HydroScript.Parse (hydroscript\\parser\\index.js)";
            var compile_stack = "    at HydroScript.Compile (hydroscript\\compiler\\index.js)";
            switch (process_type) {
                case process_1.ProcessType.Lex:
                    stack.push(lex_stack);
                    break;
                case process_1.ProcessType.Parse:
                    stack.push(parse_stack);
                    break;
                case process_1.ProcessType.Compile:
                    stack.push(compile_stack);
                    break;
            }
        }
        _this.stack = stack.join("\n");
        _this._display = (function () {
            if (!_this._path || _this._path == "<unknown>")
                return "\n" + _this.stack + "\n\nHydroScript v".concat(__1.version, "\n");
            var error_line = fs.readFileSync(_this._path, "utf-8").split("\n")[_this._line - 1];
            var start = Math.max(0, _this._column - 32);
            var end = Math.min(error_line.length, _this._column + 32);
            var shifted = error_line.length != end - start;
            var display = __spreadArray([
                "".concat(shifted ? "      " : "").concat(error_line.substring(start, end)),
                (shifted ? "      " : "") + " ".repeat(_this._column - 1 - start) + "^",
                ""
            ], __read(_this.stack.split("\n")), false);
            return "\n" + display.join("\n") + "\n\nHydroScript v".concat(__1.version, "\n");
        })();
        return _this;
    }
    HydroScriptSyntaxError.prototype.toString = function () {
        return this._display;
    };
    return HydroScriptSyntaxError;
}(Error));
exports.default = HydroScriptSyntaxError;
