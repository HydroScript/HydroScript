"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var format_indents_1 = require("../utils/format_indents");
var format_string_literal_1 = require("../utils/format_string_literal");
var error_1 = require("../error");
var PythonCompiler = (function () {
    function PythonCompiler() {
    }
    PythonCompiler.prototype.compile = function (program) {
        var e_1, _a;
        this.imports = [];
        this.options = program.options;
        var result = "";
        for (var i = 0; i <= program.body.length - 1; i++) {
            var statement = program.body[i];
            result += this.compile_statement(statement, 0);
        }
        var imports = [];
        try {
            for (var _b = __values(this.imports), _c = _b.next(); !_c.done; _c = _b.next()) {
                var importing = _c.value;
                imports.push("import ".concat((0, format_string_literal_1.default)(importing[1]), " as ").concat(importing[0].symbol));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        imports.push("");
        return result;
    };
    PythonCompiler.prototype.compile_statement = function (statement, indents) {
        if (indents === void 0) { indents = 0; }
        switch (statement.kind) {
            case "Program":
                return this.compile(statement);
            case "Block":
                return this.compile_block(statement, indents);
            case "ImportStatement":
                return this.compile_import_statement(statement, indents);
            case "ReturnStatement":
                return this.compile_return_statement(statement, indents);
            case "IfStatement":
                return this.compile_if_statement(statement, indents);
            case "NumericLiteral":
                return this.compile_numeric_literal(statement, indents);
            case "Identifier":
                return this.compile_identifier(statement, indents);
            case "AssignmentExpression":
                return this.compile_assignment_expression(statement, indents);
            case "FunctionCallExpression":
                return this.compile_function_call_expression(statement, indents);
            default:
                throw new error_1.HydroScriptInternalError("Statement kind ".concat(statement.kind, " is not yet implemented in the Python compiler"));
        }
    };
    PythonCompiler.prototype.compile_block = function (statement, indents) {
        var result = "";
        for (var i = 0; i <= statement.body.length - 1; i++) {
            var current = statement.body[i];
            result += this.compile_statement(current, indents + 1);
        }
        return result;
    };
    PythonCompiler.prototype.compile_class_block = function (statement, indents) {
    };
    PythonCompiler.prototype.compile_import_statement = function (statement, indents) {
        if (indents != 0)
            throw new error_1.HydroScriptCompileError("ImportStatement is not on top-level scope");
        this.imports.push([statement.target, statement.path]);
        return "";
    };
    PythonCompiler.prototype.compile_return_statement = function (statement, indents) {
        return "".concat((0, format_indents_1.default)(indents), "return ").concat(this.compile_statement(statement.value), "\n");
    };
    PythonCompiler.prototype.compile_if_statement = function (statement, indents) {
        var condition = this.compile_statement(statement.condition);
        var body = this.compile_block(statement.body, indents);
        var result = [
            "if ".concat(condition, ":\n"),
            body
        ];
        if (statement.else)
            result.push("else:\n", this.compile_block(statement.else, indents));
        return result.map(function (v) { return "".concat((0, format_indents_1.default)(indents)).concat(v); }).join("");
    };
    PythonCompiler.prototype.compile_numeric_literal = function (expression, indents) {
        return "".concat((0, format_indents_1.default)(indents)).concat(expression.value);
    };
    PythonCompiler.prototype.compile_identifier = function (expression, indents) {
        return "".concat((0, format_indents_1.default)(indents)).concat(expression.symbol).concat(indents != 0 ? "\n" : "");
    };
    PythonCompiler.prototype.compile_assignment_expression = function (expression, indents) {
        if (expression.left.kind != "Identifier"
            && expression.left.kind != "MemberCallExpression")
            throw new error_1.HydroScriptCompileError("Left side of AssignmentExpression: ".concat((0, error_1.format_parsing_error)(["StringLiteral", "MemberCallExpression"], expression.left.kind)));
        return "".concat((0, format_indents_1.default)(indents)).concat(this.compile_statement(expression.left), " ").concat(expression.operator, " ").concat(this.compile_statement(expression.right), "\n");
    };
    PythonCompiler.prototype.compile_function_call_expression = function (expression, indents) {
        var _this = this;
        var callee = this.compile_statement(expression.callee, indents);
        var args = expression.arguments.expressions.map(function (v) { return _this.compile_statement(v); }).join(", ");
        return "".concat(callee, "(").concat(args, ")");
    };
    return PythonCompiler;
}());
exports.default = PythonCompiler;
