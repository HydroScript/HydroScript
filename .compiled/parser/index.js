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
var token_type_1 = require("../lexer/token_type");
var lexer_1 = require("../lexer");
var process_1 = require("../process");
var remove_quotations_1 = require("../utils/remove_quotations");
var get_item_1 = require("../utils/get_item");
var throw_1 = require("../utils/throw");
var error_1 = require("../error");
var Parser = (function () {
    function Parser(path) {
        if (path === void 0) { path = "<unknown>"; }
        this.tokens = [];
        this.path = path;
    }
    Parser.prototype.is_end = function () {
        return this.tokens[0].type == token_type_1.TokenType.FileEnd;
    };
    Parser.prototype.at = function () {
        return this.tokens[0];
    };
    Parser.prototype.next = function (amount) {
        return this.tokens[amount !== null && amount !== void 0 ? amount : 1];
    };
    Parser.prototype.eat = function () {
        return this.tokens.shift();
    };
    Parser.prototype.expect = function (type) {
        var previous = this.eat();
        if (!previous || previous.type != type)
            (0, throw_1.default)(new error_1.HydroScriptSyntaxError(type, previous.type, this.path, previous.line, previous.column, process_1.ProcessType.Parse));
        return previous;
    };
    Parser.prototype.expect_multiple = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        var previous = this.eat();
        if (!previous || !types.includes(previous.type))
            (0, throw_1.default)(new error_1.HydroScriptSyntaxError(types, previous.type, this.path, previous.line, previous.column, process_1.ProcessType.Parse));
        return previous;
    };
    Parser.prototype.produce = function (code) {
        this.tokens = (0, lexer_1.tokenize)(code, this.path);
        var statements = [];
        var options = {
            set: false,
            value: {
                object: "Expression",
                kind: "ObjectLiteral",
                value: []
            }
        };
        while (!this.is_end()) {
            var statement = this.parse_statement({ is_root: true });
            if (statement.kind == "OptionsStatement") {
                if (options.set)
                    throw new error_1.HydroScriptParsingError("Options are already set");
                options.set = true;
                options.value = statement.options;
                continue;
            }
            statements.push(statement);
        }
        return {
            object: "Program",
            kind: "Program",
            body: statements,
            options: options.value
        };
    };
    Parser.prototype.parse_expression = function () {
        return this.parse_assignment_expression();
    };
    Parser.prototype.parse_assignment_expression = function () {
        var left = this.parse_instance_of();
        while (this.at().type == token_type_1.TokenType.AssignmentOperator) {
            var operator = this.eat().value;
            var right = this.parse_instance_of();
            left = {
                object: "Expression",
                kind: "AssignmentExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_instance_of = function () {
        var left = this.parse_logical_expression();
        while (this.at().type == token_type_1.TokenType.InstanceOf) {
            var operator = this.eat().value;
            var right = this.expect(token_type_1.TokenType.Identifier);
            left = {
                object: "Expression",
                kind: "InstanceOfExpression",
                target: left,
                class: {
                    object: "Expression",
                    kind: "Identifier",
                    symbol: right.value
                }
            };
        }
        return left;
    };
    Parser.prototype.parse_logical_expression = function () {
        var left = this.parse_comparison_expression();
        while (this.at().type == token_type_1.TokenType.LogicalOperator) {
            var operator = this.eat().value;
            var right = this.parse_comparison_expression();
            left = {
                object: "Expression",
                kind: "LogicalExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_comparison_expression = function () {
        var left = this.parse_of_expression();
        while (this.at().type == token_type_1.TokenType.ComparisonOperator) {
            var operator = this.eat().value;
            var right = this.parse_of_expression();
            left = {
                object: "Expression",
                kind: "ComparisonExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_of_expression = function () {
        var left = this.parse_in_expression();
        while (this.at().type == token_type_1.TokenType.Of) {
            var operator = this.eat().value;
            var right = this.parse_in_expression();
            left = {
                object: "Expression",
                kind: "OfExpression",
                left: left,
                right: right
            };
        }
        return left;
    };
    Parser.prototype.parse_in_expression = function () {
        var left = this.parse_bitwise_expression();
        while (this.at().type == token_type_1.TokenType.In) {
            var operator = this.eat().value;
            var right = this.parse_bitwise_expression();
            left = {
                object: "Expression",
                kind: "InExpression",
                left: left,
                right: right
            };
        }
        return left;
    };
    Parser.prototype.parse_bitwise_expression = function () {
        var left = this.parse_additive_expression();
        while (this.at().type == token_type_1.TokenType.BitwiseOperator) {
            var operator = this.eat().value;
            var right = this.parse_additive_expression();
            left = {
                object: "Expression",
                kind: "BitwiseExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_additive_expression = function () {
        var left = this.parse_multiplicative_expression();
        while (this.at().value == "+" || this.at().value == "-") {
            var operator = this.eat().value;
            var right = this.parse_multiplicative_expression();
            left = {
                object: "Expression",
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_multiplicative_expression = function () {
        var left = this.parse_exponential_expression();
        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            var operator = this.eat().value;
            var right = this.parse_exponential_expression();
            left = {
                object: "Expression",
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_exponential_expression = function () {
        var left = this.parse_logical_not_expression();
        while (this.at().value == "**") {
            var operator = this.eat().value;
            var right = this.parse_logical_not_expression();
            left = {
                object: "Expression",
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_logical_not_expression = function () {
        var operator = this.at().value;
        if (operator != "!")
            return this.parse_bitwise_not_expression();
        this.eat();
        return {
            object: "Expression",
            kind: "LogicalNotExpression",
            target: this.parse_logical_not_expression()
        };
    };
    Parser.prototype.parse_bitwise_not_expression = function () {
        var operator = this.at().value;
        if (operator != "~")
            return this.parse_type_of_expression();
        this.eat();
        return {
            object: "Expression",
            kind: "BitwiseNotExpression",
            target: this.parse_logical_not_expression()
        };
    };
    Parser.prototype.parse_type_of_expression = function () {
        var operator = this.at().value;
        if (operator != ";")
            return this.parse_primary_expression();
        this.eat();
        return {
            object: "Expression",
            kind: "TypeOfExpression",
            target: this.parse_logical_not_expression()
        };
    };
    Parser.prototype.parse_primary_expression = function () {
        var _this = this;
        var current_token = this.at();
        var token_type = current_token.type;
        var expression = (function () {
            if (token_type == token_type_1.TokenType.Identifier || token_type == token_type_1.TokenType.Number) {
                switch (token_type) {
                    case token_type_1.TokenType.Identifier: {
                        var id = _this.parse_identifier();
                        if (_this.at().type == token_type_1.TokenType.ArithmeticAssignment)
                            return _this.parse_arithmetic_assignment(false, id);
                        return id;
                    }
                    case token_type_1.TokenType.Number:
                        return _this.parse_numeric_literal();
                }
            }
            else if (current_token.value == "+" || current_token.value == "-") {
                return _this.parse_unary_expression();
            }
            else if (token_type == token_type_1.TokenType.RegularExpression) {
                return _this.parse_regular_expression();
            }
            else if (token_type == token_type_1.TokenType.Local) {
                return _this.parse_local_assignment_expression();
            }
            else if (token_type == token_type_1.TokenType.Function || token_type == token_type_1.TokenType.AsyncFunction) {
                return _this.parse_function_literal();
            }
            else if (token_type == token_type_1.TokenType.Class) {
                return _this.parse_class_literal();
            }
            else if (token_type == token_type_1.TokenType.New) {
                return _this.parse_new_expression();
            }
            else if (token_type == token_type_1.TokenType.Void) {
                return _this.parse_void_expression();
            }
            else if (token_type == token_type_1.TokenType.ArithmeticAssignment) {
                return _this.parse_arithmetic_assignment(true);
            }
            else if (token_type == token_type_1.TokenType.OpenParenthesis) {
                var open_1 = _this.eat();
                var value = _this.find_expression();
                var close_1 = _this.expect(token_type_1.TokenType.CloseParenthesis);
                return value;
            }
            else if (token_type == token_type_1.TokenType.Await) {
                return _this.parse_await_expression();
            }
            else if (token_type == token_type_1.TokenType.String) {
                return _this.parse_string_literal();
            }
            else if (token_type == token_type_1.TokenType.OpenSquareBracket) {
                return _this.parse_array_literal();
            }
            else if (token_type == token_type_1.TokenType.OpenCurlyBracket) {
                return _this.parse_object_literal();
            }
            (0, throw_1.default)(new error_1.HydroScriptSyntaxError(null, token_type, _this.path, current_token.line, current_token.column, process_1.ProcessType.Parse));
        })();
        while (expression.object == "Expression") {
            var next_token = this.at();
            if (next_token) {
                if (next_token.type == token_type_1.TokenType.OpenParenthesis)
                    expression = this.parse_function_call_expression(expression);
                else if (next_token.type == token_type_1.TokenType.Dot || next_token.type == token_type_1.TokenType.OpenSquareBracket) {
                    expression = this.parse_member_call_expression(expression);
                    if (this.at().type == token_type_1.TokenType.ArithmeticAssignment)
                        expression = this.parse_arithmetic_assignment(false, expression);
                }
                else if (this.at().type == token_type_1.TokenType.To && (expression.kind == "NumericLiteral" ||
                    expression.kind == "Identifier" ||
                    expression.kind == "MemberCallExpression"))
                    return this.parse_to_expression(expression);
                else
                    break;
            }
            else
                break;
        }
        return expression;
    };
    Parser.prototype.parse_local_assignment_expression = function () {
        var op = this.expect(token_type_1.TokenType.Local);
        var expr = this.find_expression();
        if (expr.kind != "AssignmentExpression")
            throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)("AssignmentExpression", expr.kind));
        return {
            object: "Expression",
            kind: "LocalAssignmentExpression",
            assignment: expr
        };
    };
    Parser.prototype.parse_unary_expression = function () {
        return {
            object: "Expression",
            kind: "UnaryExpression",
            sign: this.eat().value,
            value: this.parse_primary_expression()
        };
    };
    Parser.prototype.parse_arithmetic_assignment = function (pre, id) {
        var add = this.eat().value == "++";
        var tg = id;
        if (pre) {
            var expr = this.parse_primary_expression();
            if (expr.kind != "Identifier" && expr.kind != "MemberCallExpression")
                throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)([
                    "Identifier", "MemberCallExpression"
                ], expr.kind));
            tg = expr.kind == "Identifier" ? expr : expr;
        }
        return {
            object: "Expression",
            kind: "CommaExpression",
            expressions: [
                {
                    object: "Expression",
                    kind: "AssignmentExpression",
                    left: tg,
                    right: {
                        object: "Expression",
                        kind: "NumericLiteral",
                        value: "1"
                    },
                    operator: "".concat(add ? "+" : "-", "=")
                },
                pre ? tg : {
                    object: "Expression",
                    kind: "BinaryExpression",
                    left: tg,
                    right: {
                        object: "Expression",
                        kind: "NumericLiteral",
                        value: "1"
                    },
                    operator: !add ? "+" : "-"
                }
            ]
        };
    };
    Parser.prototype.parse_identifier = function () {
        return {
            object: "Expression",
            kind: "Identifier",
            symbol: this.expect(token_type_1.TokenType.Identifier).value
        };
    };
    Parser.prototype.parse_numeric_literal = function () {
        return {
            object: "Expression",
            kind: "NumericLiteral",
            value: this.expect(token_type_1.TokenType.Number).value
        };
    };
    Parser.prototype.parse_regular_expression = function () {
        return {
            object: "Expression",
            kind: "RegularExpression",
            value: this.expect(token_type_1.TokenType.RegularExpression).value
        };
    };
    Parser.prototype.parse_await_expression = function () {
        var await_token = this.expect(token_type_1.TokenType.Await);
        var target = this.find_expression();
        return {
            object: "Expression",
            kind: "AwaitExpression",
            target: target
        };
    };
    Parser.prototype.parse_string_literal = function () {
        var _a = __read((0, remove_quotations_1.default)(this.expect(token_type_1.TokenType.String).value), 2), text = _a[0], mark = _a[1];
        return {
            object: "Expression",
            kind: "StringLiteral",
            mark: mark,
            value: text
        };
    };
    Parser.prototype.parse_new_expression = function () {
        var start = this.expect(token_type_1.TokenType.New);
        var target = this.parse_expression();
        if (target.kind != "FunctionCallExpression")
            throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)("FunctionCallExpression", target.kind));
        return {
            object: "Expression",
            kind: "NewExpression",
            target: target
        };
    };
    Parser.prototype.parse_void_expression = function () {
        var start = this.expect(token_type_1.TokenType.Void);
        var value = this.find_expression();
        return {
            object: "Expression",
            kind: "VoidExpression",
            value: value
        };
    };
    Parser.prototype.parse_array_literal = function () {
        var open = this.expect(token_type_1.TokenType.OpenSquareBracket);
        var value = [];
        while (this.at().type != token_type_1.TokenType.CloseSquareBracket) {
            value.push(this.find_expression());
        }
        this.expect(token_type_1.TokenType.CloseSquareBracket);
        return {
            object: "Expression",
            kind: "ArrayLiteral",
            value: value
        };
    };
    Parser.prototype.parse_object_literal = function () {
        var open = this.expect(token_type_1.TokenType.OpenCurlyBracket);
        var values = [];
        while (true) {
            if (this.at().type == token_type_1.TokenType.CloseCurlyBracket)
                break;
            var key = this.expect_multiple(token_type_1.TokenType.String, token_type_1.TokenType.Identifier);
            key = (key.type == token_type_1.TokenType.String ? key : (0, lexer_1.token)("\"".concat(key.value, "\""), token_type_1.TokenType.String, key.line, key.column)).value;
            if ((0, get_item_1.default)(values, key))
                throw new error_1.HydroScriptParsingError("Dictionaries cannot have two keys with the same value");
            if (!this.next())
                throw new error_1.HydroScriptParsingError("Cannot find value in ObjectLiteral declaration");
            var value = this.find_expression();
            values.push({
                key: key,
                value: value
            });
        }
        var close = this.expect(token_type_1.TokenType.CloseCurlyBracket);
        return {
            object: "Expression",
            kind: "ObjectLiteral",
            value: values
        };
    };
    Parser.prototype.parse_to_expression = function (expr) {
        var mark = this.expect(token_type_1.TokenType.To);
        var end = this.parse_primary_expression();
        if (end.kind != "NumericLiteral" && end.kind != "Identifier" && end.kind != "MemberCallExpression")
            throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)(["NumericLiteral", "Identifier", "MemberCallExpression"], end.kind));
        var inc = {
            object: "Expression",
            kind: "NumericLiteral",
            value: "1"
        };
        if (this.at().type == token_type_1.TokenType.Increment && this.eat()) {
            var incr = this.parse_primary_expression();
            if (incr.kind != "NumericLiteral" && incr.kind != "Identifier" && incr.kind != "MemberCallExpression")
                throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)(["NumericLiteral", "Identifier", "MemberCallExpression"], incr.kind));
            switch (incr.kind) {
                case "NumericLiteral": {
                    inc = incr;
                    break;
                }
                case "Identifier": {
                    inc = incr;
                    break;
                }
                case "MemberCallExpression": {
                    inc = incr;
                    break;
                }
                default:
                    throw new error_1.HydroScriptInternalError("Invalid expression kind");
            }
        }
        return {
            object: "Expression",
            kind: "ToExpression",
            start: expr,
            end: end,
            increment: inc
        };
    };
    Parser.prototype.parse_call_expression = function (expression) {
        var op = this.expect(token_type_1.TokenType.Call);
        var func = this.find_expression();
        return {
            object: "Expression",
            kind: "FunctionCallExpression",
            callee: func,
            arguments: {
                object: "Expression",
                kind: "CommaExpression",
                expressions: [expression]
            }
        };
    };
    Parser.prototype.parse_member_call_expression = function (expression) {
        var chain = [];
        while (this.at().type == token_type_1.TokenType.Dot || this.at().type == token_type_1.TokenType.OpenSquareBracket) {
            var token_type = this.at().type;
            if (token_type == token_type_1.TokenType.Dot) {
                this.eat();
                chain.push({
                    object: "Expression",
                    kind: "StringLiteral",
                    mark: "\"",
                    value: this.expect(token_type_1.TokenType.Identifier).value
                });
            }
            else if (token_type == token_type_1.TokenType.OpenSquareBracket) {
                this.eat();
                var expr = this.find_expression();
                chain.push(expr);
                this.expect(token_type_1.TokenType.CloseSquareBracket);
            }
            else
                throw new error_1.HydroScriptInternalError("Invalid token type presented");
        }
        return {
            object: "Expression",
            kind: "MemberCallExpression",
            target: expression,
            chain: chain
        };
    };
    Parser.prototype.parse_function_call_expression = function (callee) {
        return {
            object: "Expression",
            kind: "FunctionCallExpression",
            callee: callee,
            arguments: this.parse_function_arguments()
        };
    };
    Parser.prototype.parse_function_arguments = function () {
        var exprs = [];
        var open = this.expect(token_type_1.TokenType.OpenParenthesis);
        if (this.at().type != token_type_1.TokenType.CloseParenthesis)
            exprs = this.parse_function_arguments_list();
        var close = this.expect(token_type_1.TokenType.CloseParenthesis);
        return {
            object: "Expression",
            kind: "CommaExpression",
            expressions: exprs
        };
    };
    Parser.prototype.parse_function_arguments_list = function () {
        var args = [this.find_expression()];
        while (!this.is_end() && this.at().type != token_type_1.TokenType.CloseParenthesis)
            args.push(this.find_expression());
        return args;
    };
    Parser.prototype.parse_comma_expression = function (expression) {
        if (!expression)
            this.expect(token_type_1.TokenType.OpenParenthesis);
        var exprs = [];
        if (this.at().type != token_type_1.TokenType.CloseParenthesis)
            exprs = this.parse_comma_expression_list(expression);
        else
            throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)("Expression", token_type_1.TokenType.CloseParenthesis, this.at().line, this.at()));
        if (!expression)
            this.expect(token_type_1.TokenType.CloseParenthesis);
        return {
            object: "Expression",
            kind: "CommaExpression",
            expressions: exprs
        };
    };
    Parser.prototype.parse_comma_expression_list = function (expression) {
        var args = [expression ? expression : this.find_expression()];
        while (!this.is_end() && this.at().type == token_type_1.TokenType.Comma && this.eat()) {
            var expression_1 = this.find_expression();
            if (expression_1.kind == "CommaExpression")
                args.push.apply(args, __spreadArray([], __read(expression_1.expressions), false));
            else
                args.push(expression_1);
        }
        return args;
    };
    Parser.prototype.find_expression = function () {
        var expr = this.parse_statement();
        if (expr.object != "Expression")
            throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)("Expression", "Statement"));
        return expr;
    };
    Parser.prototype.parse_statement = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var result = (function () {
            var _a, _b;
            if (_this.at().type == token_type_1.TokenType.Import)
                return _this.parse_import_statement();
            if (_this.at().type == token_type_1.TokenType.Declarator)
                return _this.parse_declaration_statement();
            if (_this.at().type == token_type_1.TokenType.Continue)
                return _this.parse_continue_statement();
            if (_this.at().type == token_type_1.TokenType.Break)
                return _this.parse_break_statement();
            if (_this.at().type == token_type_1.TokenType.Return)
                return _this.parse_return_statement();
            if (_this.at().type == token_type_1.TokenType.Try)
                return _this.parse_try_statement();
            if (_this.at().type == token_type_1.TokenType.Throw)
                return _this.parse_throw_statement();
            if (_this.at().type == token_type_1.TokenType.Static)
                return _this.parse_static_property_declaration((_a = options.in_class) !== null && _a !== void 0 ? _a : false);
            if (_this.at().type == token_type_1.TokenType.Colon &&
                _this.next().type == token_type_1.TokenType.Identifier &&
                _this.next(2).type == token_type_1.TokenType.Colon)
                return _this.parse_environment_statement((_b = options.is_root) !== null && _b !== void 0 ? _b : false);
            var statement = _this.parse_expression();
            var result = statement;
            while (result.object == "Expression") {
                if (_this.at().type == token_type_1.TokenType.QuestionMark) {
                    result = _this.parse_if_statement(result);
                    continue;
                }
                else if (_this.at().type == token_type_1.TokenType.Unless) {
                    result = _this.parse_if_statement({
                        object: "Expression",
                        kind: "LogicalNotExpression",
                        target: result
                    });
                    continue;
                }
                else if (_this.at().type == token_type_1.TokenType.Loop) {
                    result = _this.parse_loop_statement(result);
                    break;
                }
                else if (_this.at().type == token_type_1.TokenType.Comma) {
                    result = _this.parse_comma_expression(result);
                    continue;
                }
                else if (_this.at().type == token_type_1.TokenType.Call) {
                    result = _this.parse_call_expression(result);
                    continue;
                }
                else
                    break;
            }
            return result;
        })();
        while (true) {
            if (this.at().type == token_type_1.TokenType.ShortIfOperator || this.at().type == token_type_1.TokenType.ShortUnlessOperator) {
                result = this.parse_short_if_statement(result);
            }
            else
                break;
        }
        return result;
    };
    Parser.prototype.parse_block = function () {
        var has_brackets = true;
        if (this.at().type != token_type_1.TokenType.OpenCurlyBracket)
            has_brackets = false;
        else
            this.expect(token_type_1.TokenType.OpenCurlyBracket);
        var statements = [];
        if (has_brackets) {
            while (true) {
                if (this.at().type == token_type_1.TokenType.CloseCurlyBracket)
                    break;
                statements.push(this.parse_statement());
            }
            var end = this.expect(token_type_1.TokenType.CloseCurlyBracket);
        }
        else
            statements.push(this.parse_statement());
        return {
            object: "Statement",
            kind: "Block",
            body: statements
        };
    };
    Parser.prototype.parse_class_block = function () {
        var open = this.expect(token_type_1.TokenType.OpenCurlyBracket);
        var statics = [];
        var default_constructor = null;
        var constructor = default_constructor;
        var initializers = [];
        var definitions = [];
        var getters = [];
        var setters = [];
        var statements = [];
        while (true) {
            var current = this.at();
            if (current.object == "Token" && current.type == token_type_1.TokenType.CloseCurlyBracket)
                break;
            var statement = current.type == token_type_1.TokenType.Get ?
                this.parse_getter() : current.type == token_type_1.TokenType.Set ?
                this.parse_setter() : this.parse_statement({ in_class: true });
            if (statement.object == "Statement" && statement.kind != "StaticPropertyDeclaration" && statement.kind != "Getter" && statement.kind != "Setter")
                throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)(["Expression", "StaticPropertyDeclaration"], statement.kind));
            statements.push(statement);
        }
        var end = this.expect(token_type_1.TokenType.CloseCurlyBracket);
        for (var i = 0; i <= statements.length - 1; i++) {
            var current = statements[i];
            if (current.kind == "StaticPropertyDeclaration")
                statics.push(current);
            else if (current.kind == "AssignmentExpression") {
                if (current.operator != "=")
                    throw new error_1.HydroScriptParsingError("Assignment operator in ClassLiteral definition is not =");
                definitions.push(current);
            }
            else if (current.kind == "FunctionLiteral") {
                if (constructor != default_constructor)
                    throw new error_1.HydroScriptParsingError("ClassLiteral definition cannot contain two or more constructors");
                if (current.async)
                    throw new error_1.HydroScriptParsingError("Constructor cannot be asynchronous");
                constructor = current;
            }
            else if (current.kind == "Identifier")
                initializers.push(current);
            else if (current.kind == "Getter")
                getters.push(current);
            else if (current.kind == "Setter")
                setters.push(current);
            else
                throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)(["AssignmentExpression", "FunctionLiteral", "Identifier"], current.kind));
        }
        return {
            object: "Statement",
            kind: "ClassBlock",
            statics: statics,
            constructor: constructor,
            initializers: initializers,
            definitions: definitions,
            getters: getters,
            setters: setters
        };
    };
    Parser.prototype.parse_getter = function () {
        var op = this.expect(token_type_1.TokenType.Get);
        var name = this.parse_identifier();
        var block = this.parse_block();
        return {
            object: "Statement",
            kind: "Getter",
            name: name,
            body: block
        };
    };
    Parser.prototype.parse_setter = function () {
        var op = this.expect(token_type_1.TokenType.Set);
        var name = this.parse_identifier();
        var parameter = this.parse_identifier();
        var body = this.parse_block();
        return {
            object: "Statement",
            kind: "Setter",
            name: name,
            parameter: parameter,
            body: body
        };
    };
    Parser.prototype.parse_class_literal = function () {
        var start = this.expect(token_type_1.TokenType.Class);
        var extending = null;
        if (this.at().type == token_type_1.TokenType.Colon) {
            this.eat();
            extending = this.find_expression();
        }
        var definition = this.parse_class_block();
        return {
            object: "Expression",
            kind: "ClassLiteral",
            extends: extending,
            definition: definition
        };
    };
    Parser.prototype.parse_import_statement = function () {
        var start = this.expect(token_type_1.TokenType.Import);
        var target = this.parse_identifier();
        var path = this.parse_string_literal();
        return {
            object: "Statement",
            kind: "ImportStatement",
            target: target,
            path: path
        };
    };
    Parser.prototype.parse_declaration_statement = function () {
        var op = this.expect(token_type_1.TokenType.Declarator);
        var target = this.parse_identifier();
        var value = this.find_expression();
        return {
            object: "Statement",
            kind: "DeclarationStatement",
            target: target,
            value: value
        };
    };
    Parser.prototype.parse_continue_statement = function () {
        var op = this.expect(token_type_1.TokenType.Continue);
        return {
            object: "Statement",
            kind: "ContinueStatement"
        };
    };
    Parser.prototype.parse_break_statement = function () {
        var op = this.expect(token_type_1.TokenType.Break);
        return {
            object: "Statement",
            kind: "BreakStatement"
        };
    };
    Parser.prototype.parse_return_statement = function () {
        var operator = this.expect(token_type_1.TokenType.Return);
        return {
            object: "Statement",
            kind: "ReturnStatement",
            value: this.find_expression()
        };
    };
    Parser.prototype.parse_throw_statement = function () {
        var operator = this.expect(token_type_1.TokenType.Throw);
        return {
            object: "Statement",
            kind: "ThrowStatement",
            value: this.find_expression()
        };
    };
    Parser.prototype.parse_static_property_declaration = function (in_class) {
        if (!in_class)
            throw new error_1.HydroScriptParsingError("Found StaticPropertyDeclaration outside of ClassBlock");
        var operator = this.expect(token_type_1.TokenType.Static);
        return {
            object: "Statement",
            kind: "StaticPropertyDeclaration",
            expression: this.at().type == token_type_1.TokenType.Get ?
                this.parse_getter() : this.at().type == token_type_1.TokenType.Set ?
                this.parse_setter() : {
                object: "Expression",
                kind: "AssignmentExpression",
                left: this.parse_identifier(),
                right: this.find_expression(),
                operator: "="
            }
        };
    };
    Parser.prototype.parse_if_statement = function (expression) {
        var mark = this.expect_multiple(token_type_1.TokenType.QuestionMark, token_type_1.TokenType.Unless);
        var body = this.parse_block();
        var else_body = null;
        var current = this.at();
        if (current && current.object == "Token" && current.type == token_type_1.TokenType.Colon) {
            var colon = this.expect(token_type_1.TokenType.Colon);
            else_body = this.parse_block();
        }
        if (else_body &&
            (body.body.length == 1 && body.body[0].object == "Expression") &&
            (else_body.body.length == 1 && else_body.body[0].object == "Expression"))
            return {
                object: "Expression",
                kind: "ConditionalExpression",
                condition: expression,
                body: body.body[0],
                else: else_body.body[0]
            };
        return {
            kind: "IfStatement",
            condition: expression,
            body: body,
            else: else_body
        };
    };
    Parser.prototype.parse_loop_statement = function (expression) {
        var _this = this;
        var mark = this.expect(token_type_1.TokenType.Loop);
        var loop = (function (expr) {
            switch (expr.kind) {
                case "CommaExpression": {
                    if (expr.expressions.length == 3) {
                        var _a = __read(expr.expressions, 3), initialize = _a[0], condition = _a[1], afterthought = _a[2];
                        return {
                            type: "For",
                            initialize: initialize,
                            condition: condition,
                            afterthought: afterthought,
                            body: _this.parse_block()
                        };
                    }
                }
                case "InExpression":
                    if (expr.left.kind != "Identifier")
                        throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)("Identifier", expr.left.kind));
                    return {
                        type: "ForIn",
                        in: expr,
                        body: _this.parse_block()
                    };
                case "OfExpression":
                    if (expr.left.kind != "Identifier")
                        throw new error_1.HydroScriptParsingError((0, error_1.format_parsing_error)("Identifier", expr.left.kind));
                    return {
                        type: "ForOf",
                        of: expr,
                        body: _this.parse_block()
                    };
                default:
                    return {
                        type: "While",
                        condition: expr,
                        body: _this.parse_block()
                    };
            }
        })(expression);
        return {
            object: "Statement",
            kind: "LoopStatement",
            loop: loop
        };
    };
    Parser.prototype.parse_try_statement = function () {
        var mark = this.expect(token_type_1.TokenType.Try);
        var try_block = this.parse_block();
        var catch_block = null;
        var finally_block = null;
        if (this.at().type == token_type_1.TokenType.Catch) {
            this.expect(token_type_1.TokenType.Catch);
            catch_block = {
                identifier: this.parse_identifier(),
                body: this.parse_block()
            };
        }
        if (this.at().type == token_type_1.TokenType.Finally) {
            this.expect(token_type_1.TokenType.Finally);
            finally_block = this.parse_block();
        }
        if (!(catch_block || finally_block))
            catch_block = {
                identifier: {
                    object: "Expression",
                    kind: "Identifier",
                    symbol: "_"
                },
                body: {
                    object: "Statement",
                    kind: "Block",
                    body: []
                }
            };
        return {
            object: "Statement",
            kind: "TryStatement",
            try: try_block,
            catch: catch_block,
            finally: finally_block
        };
    };
    Parser.prototype.parse_function_literal = function () {
        var sign = this.expect_multiple(token_type_1.TokenType.Function, token_type_1.TokenType.AsyncFunction);
        return {
            object: "Expression",
            kind: "FunctionLiteral",
            parameters: this.parse_function_parameters(),
            body: this.parse_block(),
            async: sign.value == ">>-"
        };
    };
    Parser.prototype.parse_function_parameters = function () {
        var params = [];
        while (this.at().type == token_type_1.TokenType.Identifier && (this.next().type != token_type_1.TokenType.BinaryOperator &&
            this.next().type != token_type_1.TokenType.ComparisonOperator &&
            this.next().type != token_type_1.TokenType.OpenParenthesis &&
            this.next().type != token_type_1.TokenType.CloseParenthesis &&
            this.next().type != token_type_1.TokenType.QuestionMark &&
            this.next().type != token_type_1.TokenType.ShortIfOperator &&
            this.next().type != token_type_1.TokenType.Unless &&
            this.next().type != token_type_1.TokenType.ShortUnlessOperator &&
            this.next().type != token_type_1.TokenType.Loop &&
            this.next().type != token_type_1.TokenType.AssignmentOperator &&
            this.next().type != token_type_1.TokenType.LogicalOperator &&
            this.next().type != token_type_1.TokenType.BitwiseOperator &&
            this.next().type != token_type_1.TokenType.InstanceOf &&
            this.next().type != token_type_1.TokenType.In &&
            this.next().type != token_type_1.TokenType.Of &&
            this.next().type != token_type_1.TokenType.To &&
            this.next().type != token_type_1.TokenType.Dot &&
            this.next().type != token_type_1.TokenType.Comma &&
            this.next().type != token_type_1.TokenType.FileEnd))
            params.push(this.parse_identifier());
        return params;
    };
    Parser.prototype.parse_short_if_statement = function (statement) {
        var unless = this.eat().type == token_type_1.TokenType.ShortUnlessOperator;
        var condition = !unless ? this.find_expression() : {
            object: "Expression",
            kind: "LogicalNotExpression",
            target: this.find_expression()
        };
        var else_stmt = null;
        if (this.at().type == token_type_1.TokenType.Colon && this.eat())
            else_stmt = this.parse_statement();
        return {
            object: "Statement",
            kind: "ShortIfStatement",
            statement: statement,
            condition: condition,
            else: else_stmt
        };
    };
    Parser.prototype.parse_environment_statement = function (is_root) {
        if (is_root === void 0) { is_root = false; }
        if (!is_root)
            throw new error_1.HydroScriptParsingError("Environment statements must be in the root of a file");
        var identifier = this.next();
        if (identifier.value == "options")
            return this.parse_options_statement();
        else
            throw new error_1.HydroScriptParsingError("Unexpected environment statement name");
    };
    Parser.prototype.parse_options_statement = function () {
        var colon1 = this.expect(token_type_1.TokenType.Colon);
        var options_identifier = this.expect(token_type_1.TokenType.Identifier);
        var colon2 = this.expect(token_type_1.TokenType.Colon);
        return {
            object: "Statement",
            kind: "OptionsStatement",
            options: this.parse_object_literal()
        };
    };
    return Parser;
}());
exports.default = Parser;
