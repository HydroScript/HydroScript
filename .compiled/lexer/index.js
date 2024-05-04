"use strict";
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
exports.tokenize = exports.token = exports.is_skippable = exports.is_operator = exports.is_int = exports.can_use_in_indentifier = exports.is_alpha = void 0;
var operators_1 = require("../data/operators");
var skippable_1 = require("../data/skippable");
var token_type_1 = require("./token_type");
var error_1 = require("../error");
var throw_1 = require("../utils/throw");
var process_1 = require("../process");
function is_alpha(src) {
    return src.toUpperCase() != src.toLowerCase();
}
exports.is_alpha = is_alpha;
function can_use_in_indentifier(src) {
    if (/[a-zA-Z_$]/.test(src))
        return true;
    if (/\p{L}|\p{N}|\p{Pc}|\p{Mn}|\p{Mc}/u.test(src))
        return true;
    return false;
}
exports.can_use_in_indentifier = can_use_in_indentifier;
function is_int(src) {
    var char = src.charCodeAt(0);
    var bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return (char >= bounds[0] && char <= bounds[1]);
}
exports.is_int = is_int;
function is_operator(src) {
    return !is_int(src) && !is_alpha(src) && !is_skippable(src);
}
exports.is_operator = is_operator;
function is_skippable(src) {
    return skippable_1.default[src] ? true : false;
}
exports.is_skippable = is_skippable;
function token(value, type, line, column) {
    if (value === void 0) { value = ""; }
    return {
        object: "Token",
        type: type,
        value: value,
        line: line,
        column: column
    };
}
exports.token = token;
function tokenize(code, path) {
    var _a, _b;
    var tokens = [];
    var sources = code.split("\n").map(function (v) { return v.split(""); });
    var _loop_1 = function (i) {
        var source = __spreadArray([], __read(sources[i - 1]), false);
        var getColumn = function () { return sources[i - 1].length - source.length + 1; };
        var _loop_2 = function () {
            if (is_skippable(source[0])) {
                source.shift();
            }
            else if (source[0] == "\"" || source[0] == "'") {
                var column = getColumn();
                var mark = source.shift();
                var text = mark;
                while (source[0] && source[0] != mark) {
                    var current = source.shift();
                    if (current == "\n")
                        (0, throw_1.default)(new error_1.HydroScriptSyntaxError(token_type_1.TokenType.QuotationMark, "\\n", path, i, column, process_1.ProcessType.Lex));
                    if (current == "\\")
                        text += "\\".concat((_a = source.shift()) !== null && _a !== void 0 ? _a : "");
                    else
                        text += current;
                }
                if (!source[0])
                    (0, throw_1.default)(new error_1.HydroScriptSyntaxError(null, token_type_1.TokenType.FileEnd, path, i, column, process_1.ProcessType.Lex));
                var end = source.shift();
                tokens.push(token(text + end, token_type_1.TokenType.String, i, column));
            }
            else if (source[0] + source[1] == ",,") {
                var column = getColumn();
                var mark = source.shift() + source.shift();
                var text = "/";
                while (source[0] && source[1] && source[0] + source[1] != mark) {
                    var current = source.shift();
                    if (current == "\n")
                        (0, throw_1.default)(new error_1.HydroScriptSyntaxError(token_type_1.TokenType.RegularExpressionMark, "\\n", path, i, column, process_1.ProcessType.Lex));
                    if (current == "\\")
                        text += "\\".concat((_b = source.shift()) !== null && _b !== void 0 ? _b : "");
                    if (current == "/")
                        text += "\\".concat(current);
                    else
                        text += current;
                }
                if (!source[0] || !source[1])
                    (0, throw_1.default)(new error_1.HydroScriptSyntaxError(null, token_type_1.TokenType.FileEnd, path, i, column, process_1.ProcessType.Lex));
                var end = source.shift() + source.shift();
                var flags = [];
                while (source[0] == "g" || source[0] == "i" || source[0] == "m" ||
                    source[0] == "s" || source[0] == "u" || source[0] == "y") {
                    if (flags.includes(source[0]))
                        throw new error_1.HydroScriptSyntaxError(token_type_1.TokenType.RegularExpressionMark, source[0], path, i, column, process_1.ProcessType.Lex);
                    flags.push(source.shift());
                }
                tokens.push(token("".concat(text, "/").concat(flags.join("")), token_type_1.TokenType.RegularExpression, i, column));
            }
            else if (can_use_in_indentifier(source[0]) && !is_int(source[0])) {
                var column = getColumn();
                var identifier = "";
                while (source.length > 0 && can_use_in_indentifier(source[0]))
                    identifier += source.shift();
                tokens.push(token(identifier, token_type_1.TokenType.Identifier, i, column));
                while (is_skippable(source[0]))
                    source.shift();
            }
            else if ((is_int(source[0]) || source[0] == ".") && source[0] + source[1] != "..") {
                var column = getColumn();
                var num = "";
                var is_decimal = false;
                while (source.length > 0 && (is_int(source[0]) || (!is_decimal && source[0] == "."))) {
                    if (source[0] + source[1] == "..")
                        break;
                    if (!is_decimal && source[0] == ".")
                        is_decimal = true;
                    num += source.shift();
                }
                if (num == ".")
                    tokens.push(token(num, token_type_1.TokenType.Dot, i, column));
                else
                    tokens.push(token("".concat(num.startsWith(".") ? "0" : "").concat(num).concat(num.endsWith(".") ? "0" : ""), token_type_1.TokenType.Number, i, column));
            }
            else if (source[0] + source[1] == "//" || source[0] + source[1] == "/*") {
                if (source[0] + source[1] == "/*")
                    while (source[0] + source[1] != "*/")
                        source.shift();
                else
                    while (source[0] && source[0] != "\n")
                        source.shift();
                if (source[0] + source[1] == "*/")
                    source.shift(), source.shift();
            }
            else {
                var column = getColumn();
                var op_1 = "";
                while (source.length > 0 && is_operator(source[0])) {
                    if (!Object.keys(operators_1.default).some(function (key) { return key.startsWith(op_1 + source[0]); }))
                        break;
                    op_1 += source.shift();
                }
                var type = operators_1.default[op_1];
                if (!type)
                    (0, throw_1.default)(new error_1.HydroScriptSyntaxError(null, op_1, path, i, column, process_1.ProcessType.Lex));
                tokens.push(token(op_1, type, i, column));
            }
        };
        while (source.length > 0) {
            _loop_2();
        }
    };
    for (var i = 1; i <= sources.length; i++) {
        _loop_1(i);
    }
    tokens.push(token(undefined, token_type_1.TokenType.FileEnd, sources.length, sources[sources.length - 1].length + 1));
    return tokens;
}
exports.tokenize = tokenize;
