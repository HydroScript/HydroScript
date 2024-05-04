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
var component_1 = require("./component");
var format_string_literal_1 = require("../utils/format_string_literal");
var list_to_dict_string_1 = require("../utils/list_to_dict_string");
var is_reserved_1 = require("../utils/is_reserved");
var get_item_1 = require("../utils/get_item");
var error_1 = require("../error");
var libs_1 = require("../libs");
var JavaScriptCompiler = (function () {
    function JavaScriptCompiler() {
        this.export = null;
        this.variables = [];
        this.states = {
            libs: {
                __to: false
            }
        };
    }
    JavaScriptCompiler.prototype.compile = function (program) {
        var e_1, _a;
        var _b;
        this.imports = [];
        this.export = null;
        this.variables = [];
        this.options = program.options;
        var result = "";
        for (var i = 0; i <= program.body.length - 1; i++) {
            var statement = program.body[i];
            var stmt = this.compile_statement(statement, true, { block_root: true, global_scope: true });
            if (stmt.data.declaration)
                this.variables.push(stmt.data.declaration);
            result += stmt.raw;
        }
        var libs = "";
        if (this.states.libs.__to)
            libs += libs_1.default.__to + "\n";
        var variables = "";
        if (this.variables.length != 0)
            variables = "var ".concat(__spreadArray([], __read(new Set(this.variables)), false).join(", "), ";\n");
        var imports = "";
        try {
            for (var _c = __values(this.imports), _d = _c.next(); !_d.done; _d = _c.next()) {
                var importing = _d.value;
                imports += "import ".concat(importing[0].symbol, " from ").concat((0, format_string_literal_1.default)(importing[1]), ";\n");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var defaults = {
            object: "Expression",
            kind: "Identifier",
            symbol: "true"
        };
        var strict_option = ((_b = (0, get_item_1.default)(this.options.value, "strict")) !== null && _b !== void 0 ? _b : defaults);
        if (strict_option.kind != "Identifier" || (strict_option.symbol != "true" && strict_option.symbol != "false"))
            throw new error_1.HydroScriptCompileError("\"strict\" option is not a valid numeric literal");
        var strict = strict_option.symbol == "true";
        return [
            strict ? "\"use strict\";\n" : "",
            imports,
            libs,
            variables,
            result,
            this.export ? "export default ".concat(this.compile_statement(this.export, true, { block_root: true })) : ""
        ].join("");
    };
    JavaScriptCompiler.prototype.compile_statement = function (statement, is_main, options) {
        var _a, _b, _c, _d;
        switch (statement.kind) {
            case "Program":
                throw new error_1.HydroScriptInternalError("Program node is not allowed in compile_statement method");
            case "Block":
                return this.compile_block(statement, is_main);
            case "ClassBlock":
                return this.compile_class_block(statement);
            case "ImportStatement":
                return this.compile_import_statement(statement);
            case "DeclarationStatement":
                return this.compile_declaration_statement(statement);
            case "LocalAssignmentExpression":
                return this.compile_local_assignment_expression(statement, is_main);
            case "ContinueStatement":
                return this.compile_continue_statement(statement);
            case "BreakStatement":
                return this.compile_break_statement(statement);
            case "ReturnStatement":
                return this.compile_return_statement(statement, (_a = (options !== null && options !== void 0 ? options : {}).global_scope) !== null && _a !== void 0 ? _a : false);
            case "ThrowStatement":
                return this.compile_throw_statement(statement);
            case "IfStatement":
                return this.compile_if_statement(statement);
            case "ShortIfStatement":
                return this.compile_short_if_statement(statement);
            case "LoopStatement":
                return this.compile_loop_statement(statement);
            case "TryStatement":
                return this.compile_try_statement(statement);
            case "StaticPropertyDeclaration":
                return this.compile_static_property_declaration(statement);
            case "Getter":
                return this.compile_getter(statement);
            case "Setter":
                return this.compile_setter(statement);
            case "NumericLiteral":
                return this.compile_numeric_literal(statement, is_main);
            case "Identifier":
                return this.compile_identifier(statement, is_main, (_b = (options !== null && options !== void 0 ? options : {}).add_suffix) !== null && _b !== void 0 ? _b : true, (_c = (options !== null && options !== void 0 ? options : {}).block_root) !== null && _c !== void 0 ? _c : false);
            case "StringLiteral":
                return this.compile_string_literal(statement, is_main);
            case "RegularExpression":
                return this.compile_regular_expression(statement, is_main);
            case "ArrayLiteral":
                return this.compile_array_literal(statement, is_main);
            case "ObjectLiteral":
                return this.compile_object_literal(statement, is_main);
            case "FunctionLiteral":
                return this.compile_function_literal(statement, is_main, (_d = (options !== null && options !== void 0 ? options : {}).is_constructor) !== null && _d !== void 0 ? _d : false);
            case "ClassLiteral":
                return this.compile_class_literal(statement, is_main);
            case "BinaryExpression":
                return this.compile_binary_expression(statement, is_main);
            case "ComparisonExpression":
                return this.compile_comparison_expression(statement, is_main);
            case "AssignmentExpression":
                return this.compile_assignment_expression(statement, is_main, true);
            case "LogicalExpression":
                return this.compile_logical_expression(statement, is_main);
            case "LogicalNotExpression":
                return this.compile_logical_not_expression(statement, is_main);
            case "BitwiseExpression":
                return this.compile_bitwise_expression(statement, is_main);
            case "BitwiseNotExpression":
                return this.compile_bitwise_not_expression(statement, is_main);
            case "InExpression":
                return this.compile_in_expression(statement, is_main);
            case "OfExpression":
                throw new error_1.HydroScriptCompileError("Statement kind OfExpression is not allowed outside of LoopStatement");
            case "ToExpression":
                return this.compile_to_expression(statement, is_main);
            case "MemberCallExpression":
                return this.compile_member_call_expression(statement, is_main);
            case "FunctionCallExpression":
                return this.compile_function_call_expression(statement, is_main);
            case "CommaExpression":
                return this.compile_comma_expression(statement, is_main);
            case "NewExpression":
                return this.compile_new_expression(statement, is_main);
            case "VoidExpression":
                return this.compile_void_expression(statement, is_main);
            case "ConditionalExpression":
                return this.compile_conditional_expression(statement, is_main);
            case "InstanceOfExpression":
                return this.compile_instance_of_expression(statement, is_main);
            case "TypeOfExpression":
                return this.compile_type_of_expression(statement, is_main);
            case "AwaitExpression":
                return this.compile_await_expression(statement, is_main);
            default:
                throw new error_1.HydroScriptInternalError("Statement kind ".concat(statement.kind, " is not yet implemented in the JavaScript compiler"));
        }
    };
    JavaScriptCompiler.prototype.compile_block = function (statement, is_main) {
        var result = "";
        var locals = [];
        for (var i = 0; i <= statement.body.length - 1; i++) {
            var current = statement.body[i];
            var stmt = this.compile_statement(current, true, { block_root: true });
            if (stmt.data.declaration)
                locals.push(stmt.data.declaration);
            result += stmt;
        }
        return new component_1.default("{\n".concat(locals.length > 0 ? "var ".concat(__spreadArray([], __read(new Set(locals)), false).join(", "), ";\n") : "").concat(result, "}").concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_class_block = function (statement) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e;
        var constructor = statement.constructor, definitions = statement.definitions, initializers = statement.initializers, statics = statement.statics, getters = statement.getters, setters = statement.setters;
        var static_statements = [];
        try {
            for (var statics_1 = __values(statics), statics_1_1 = statics_1.next(); !statics_1_1.done; statics_1_1 = statics_1.next()) {
                var stmt = statics_1_1.value;
                static_statements.push(this.compile_static_property_declaration(stmt).raw);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (statics_1_1 && !statics_1_1.done && (_a = statics_1.return)) _a.call(statics_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var definition_statements = [];
        try {
            for (var definitions_1 = __values(definitions), definitions_1_1 = definitions_1.next(); !definitions_1_1.done; definitions_1_1 = definitions_1.next()) {
                var stmt = definitions_1_1.value;
                if (stmt.left.kind != "Identifier")
                    throw new error_1.HydroScriptCompileError("Left side of method/property definition is not Identifier");
                var compiled = stmt.right.kind == "FunctionLiteral" ?
                    this.compile_function_literal(stmt.right, true, false, this.compile_identifier(stmt.left, false, false).raw) :
                    this.compile_assignment_expression(stmt, true, false, false, false);
                definition_statements.push(compiled.raw);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (definitions_1_1 && !definitions_1_1.done && (_b = definitions_1.return)) _b.call(definitions_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var constructor_string = constructor ? this.compile_function_literal(constructor, true, true).raw : "";
        var initializer_expressions = [];
        try {
            for (var initializers_1 = __values(initializers), initializers_1_1 = initializers_1.next(); !initializers_1_1.done; initializers_1_1 = initializers_1.next()) {
                var init = initializers_1_1.value;
                initializer_expressions.push(this.compile_identifier(init, true, false).raw);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (initializers_1_1 && !initializers_1_1.done && (_c = initializers_1.return)) _c.call(initializers_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var getter_statements = [];
        try {
            for (var getters_1 = __values(getters), getters_1_1 = getters_1.next(); !getters_1_1.done; getters_1_1 = getters_1.next()) {
                var gtr = getters_1_1.value;
                getter_statements.push(this.compile_getter(gtr).raw);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (getters_1_1 && !getters_1_1.done && (_d = getters_1.return)) _d.call(getters_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        var setter_statements = [];
        try {
            for (var setters_1 = __values(setters), setters_1_1 = setters_1.next(); !setters_1_1.done; setters_1_1 = setters_1.next()) {
                var str = setters_1_1.value;
                setter_statements.push(this.compile_setter(str).raw);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (setters_1_1 && !setters_1_1.done && (_e = setters_1.return)) _e.call(setters_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return new component_1.default("{\n".concat(static_statements.join("")).concat(initializer_expressions.join("")).concat(constructor_string).concat(definition_statements.join("")).concat(getter_statements.join("")).concat(setter_statements.join(""), "}"));
    };
    JavaScriptCompiler.prototype.compile_import_statement = function (statement) {
        this.imports.push([statement.target, statement.path]);
        return new component_1.default();
    };
    JavaScriptCompiler.prototype.compile_declaration_statement = function (statement) {
        var str = "var ".concat(this.compile_identifier(statement.target, false), " = ").concat(this.compile_statement(statement.value, true));
        return new component_1.default(str);
    };
    JavaScriptCompiler.prototype.compile_local_assignment_expression = function (expression, is_main) {
        return new component_1.default(this.compile_assignment_expression(expression.assignment, is_main, false, true, true).raw, expression.assignment.left.kind == "Identifier" ? {
            declaration: this.compile_identifier(expression.assignment.left, false, true)
        } : {});
    };
    JavaScriptCompiler.prototype.compile_continue_statement = function (statement) {
        return new component_1.default("continue;\n");
    };
    JavaScriptCompiler.prototype.compile_break_statement = function (statement) {
        return new component_1.default("break;\n");
    };
    JavaScriptCompiler.prototype.compile_return_statement = function (statement, global_scope) {
        if (global_scope) {
            if (this.export)
                throw new error_1.HydroScriptCompileError("Found multiple export statements");
            this.export = statement.value;
            return new component_1.default();
        }
        return new component_1.default("return ".concat(this.compile_statement(statement.value, true)));
    };
    JavaScriptCompiler.prototype.compile_throw_statement = function (statement) {
        return new component_1.default("throw ".concat(this.compile_statement(statement.value, true)));
    };
    JavaScriptCompiler.prototype.compile_if_statement = function (statement) {
        var condition = this.compile_statement(statement.condition, false).raw;
        var body = this.compile_block(statement.body, false).raw;
        var else_body = statement.else ? this.compile_block(statement.else, true).raw : "";
        return new component_1.default("if ".concat(condition.startsWith("(") ? condition : "(".concat(condition, ")"), " ").concat(body).concat(statement.else ? " else ".concat(else_body) : ""));
    };
    JavaScriptCompiler.prototype.compile_short_if_statement = function (statement) {
        var stmt = this.compile_statement(statement.statement, true).raw;
        var condition = this.compile_statement(statement.condition, false).raw;
        var else_body = "";
        if (statement.else)
            else_body = " else ".concat(this.compile_statement(statement.else, true).raw);
        return new component_1.default("if ".concat(condition.startsWith("(") ? condition : "(".concat(condition, ")"), " ").concat(stmt).concat(else_body));
    };
    JavaScriptCompiler.prototype.compile_loop_statement = function (statement) {
        switch (statement.loop.type) {
            case "While": {
                var condition = this.compile_statement(statement.loop.condition, false).raw;
                var body = this.compile_block(statement.loop.body, true).raw;
                return new component_1.default("while ".concat(condition.startsWith("(") ? condition : "(".concat(condition, ")"), " ").concat(body));
            }
            case "For": {
                var initialize = this.compile_statement(statement.loop.initialize, true).raw;
                var condition = this.compile_statement(statement.loop.condition, true).raw;
                var afterthought = this.compile_statement(statement.loop.afterthought, false).raw;
                var body = this.compile_block(statement.loop.body, true).raw;
                return new component_1.default("for (".concat(initialize, " ").concat(condition, " ").concat(afterthought, ") ").concat(body));
            }
            case "ForIn": {
                var in_expr = this.compile_in_expression(statement.loop.in, false, true).raw;
                var body = this.compile_block(statement.loop.body, true).raw;
                return new component_1.default("for ".concat(in_expr, " ").concat(body));
            }
            case "ForOf": {
                var of_expr = this.compile_of_expression(statement.loop.of, false, true).raw;
                var body = this.compile_block(statement.loop.body, false).raw;
                return new component_1.default("for ".concat(of_expr, " ").concat(body));
            }
            default:
                throw new error_1.HydroScriptInternalError("This loop type has not yet been implemented in the JavaScript compiler");
        }
    };
    JavaScriptCompiler.prototype.compile_try_statement = function (statement) {
        var try_body = "try ".concat(this.compile_statement(statement.try, false));
        var catch_body = "";
        var finally_body = "";
        if (statement.catch)
            catch_body = " catch (".concat(this.compile_identifier(statement.catch.identifier, false), ") ").concat(this.compile_block(statement.catch.body, false));
        if (statement.finally)
            finally_body = " finally ".concat(this.compile_block(statement.finally, false));
        return new component_1.default("".concat(try_body).concat(catch_body).concat(finally_body, ";\n"));
    };
    JavaScriptCompiler.prototype.compile_static_property_declaration = function (statement) {
        if (statement.expression.kind == "AssignmentExpression")
            return new component_1.default("static ".concat(this.compile_assignment_expression(statement.expression, true, false, false, false)));
        else
            return new component_1.default("static ".concat(this.compile_statement(statement.expression, true)));
    };
    JavaScriptCompiler.prototype.compile_getter = function (statement) {
        var block = statement.body.body.length == 1 && statement.body.body[0].object == "Expression" ?
            "{\nreturn ".concat(this.compile_statement(statement.body.body[0], true), "}") :
            this.compile_block(statement.body, false);
        return new component_1.default("get ".concat(this.compile_identifier(statement.name, false, false), "() ").concat(block, ";\n"));
    };
    JavaScriptCompiler.prototype.compile_setter = function (statement) {
        var id = this.compile_identifier(statement.name, false, false);
        var param = this.compile_identifier(statement.parameter, false, true);
        var block = statement.body.body.length == 1 && statement.body.body[0].object == "Expression" ?
            "{\nreturn ".concat(this.compile_statement(statement.body.body[0], true), "}") :
            this.compile_block(statement.body, false);
        return new component_1.default("set ".concat(id, "(").concat(param, ") ").concat(block, ";\n"));
    };
    JavaScriptCompiler.prototype.compile_numeric_literal = function (expression, is_main) {
        return new component_1.default("".concat(expression.value).concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_identifier = function (expression, is_main, suffix, block_root) {
        var _a;
        if (suffix === void 0) { suffix = true; }
        if (block_root === void 0) { block_root = false; }
        var defaults = {
            object: "Expression",
            kind: "Identifier",
            symbol: "false"
        };
        var force_init_var_option = ((_a = (0, get_item_1.default)(this.options.value, "force_init_var")) !== null && _a !== void 0 ? _a : defaults);
        if (force_init_var_option.kind != "Identifier" || (force_init_var_option.symbol != "true" && force_init_var_option.symbol != "false"))
            throw new error_1.HydroScriptCompileError("\"force_init_var\" option is not a valid boolean");
        var force_init_var = force_init_var_option.symbol == "true";
        if (block_root && force_init_var)
            this.variables.push((0, is_reserved_1.add_suffix)(expression.symbol));
        return new component_1.default("".concat(suffix ? (0, is_reserved_1.add_suffix)(expression.symbol) : expression.symbol).concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_string_literal = function (expression, is_main) {
        return new component_1.default("".concat((0, format_string_literal_1.default)(expression)).concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_regular_expression = function (expression, is_main) {
        return new component_1.default("".concat(expression.value).concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_array_literal = function (expression, is_main) {
        var _this = this;
        if (expression.value.length == 0)
            return new component_1.default("[]".concat(is_main ? ";\n" : ""));
        return new component_1.default("[ ".concat(expression.value.map(function (v) { return _this.compile_statement(v, false); }).join(", "), " ]").concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_object_literal = function (expression, is_main) {
        var _this = this;
        var dict = (0, list_to_dict_string_1.default)(expression.value, function (t) { return _this.compile_statement(t, false); });
        return new component_1.default("".concat(dict).concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_function_literal = function (expression, is_main, is_constructor, method_name) {
        var body = expression.body, parameters = expression.parameters;
        var asynchronous = expression.async;
        var params = [];
        for (var i = 0; i <= parameters.length - 1; i++)
            params.push(this.compile_identifier(parameters[i], false).raw);
        if (method_name && body.body.length == 1 && body.body[0].object == "Expression")
            body.body[0] = {
                object: "Statement",
                kind: "ReturnStatement",
                value: body.body[0]
            };
        var block_string = this.compile_block(body, false).raw;
        var block = body.body[0] && body.body[0].object == "Expression" && body.body.length == 1 ?
            this.compile_statement(body.body[0], false) :
            block_string;
        if (is_constructor)
            return new component_1.default("constructor(".concat(params.join(", "), ") ").concat(block_string).concat(is_main ? ";\n" : ""));
        if (method_name)
            return new component_1.default("".concat(method_name, "(").concat(params.join(", "), ") ").concat(block_string).concat(is_main ? ";\n" : ""));
        else
            return new component_1.default("".concat(!is_main ? "(" : "").concat(asynchronous ? "async " : "", "(").concat(params.join(", "), ") => ").concat(block).concat(!is_main ? ")" : "").concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_class_literal = function (expression, is_main) {
        var str = "class".concat(expression.extends ? " extends ".concat(this.compile_statement(expression.extends, false)) : "", " ").concat(this.compile_class_block(expression.definition));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_binary_expression = function (expression, is_main) {
        var str = "".concat(this.compile_statement(expression.left, false), " ").concat(expression.operator, " ").concat(this.compile_statement(expression.right, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_comparison_expression = function (expression, is_main) {
        var str = "".concat(this.compile_statement(expression.left, false), " ").concat(expression.operator, " ").concat(this.compile_statement(expression.right, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_assignment_expression = function (expression, is_main, init_var, brackets, add_suffix) {
        if (init_var === void 0) { init_var = true; }
        if (brackets === void 0) { brackets = true; }
        if (add_suffix === void 0) { add_suffix = true; }
        if (expression.left.kind != "Identifier"
            && expression.left.kind != "MemberCallExpression")
            throw new error_1.HydroScriptCompileError("Left side of AssignmentExpression: ".concat((0, error_1.format_parsing_error)(["Identifier", "MemberCallExpression"], expression.left.kind)));
        if (init_var && expression.left.kind == "Identifier")
            this.variables.push(this.compile_identifier(expression.left, false, add_suffix).raw);
        var final = "".concat(this.compile_statement(expression.left, false, { add_suffix: add_suffix }), " ").concat(expression.operator, " ").concat(this.compile_statement(expression.right, false, { add_suffix: add_suffix }));
        if (brackets && !is_main)
            return new component_1.default("(".concat(final, ")").concat(is_main ? ";\n" : ""));
        return new component_1.default("".concat(final).concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_logical_expression = function (expression, is_main) {
        var str = "".concat(this.compile_statement(expression.left, false), " ").concat(expression.operator, " ").concat(this.compile_statement(expression.right, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_logical_not_expression = function (expression, is_main) {
        var str = "!".concat(this.compile_statement(expression.target, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_bitwise_expression = function (expression, is_main) {
        var str = "".concat(this.compile_statement(expression.left, false), " ").concat(expression.operator, " ").concat(this.compile_statement(expression.right, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_bitwise_not_expression = function (expression, is_main) {
        var str = "~".concat(this.compile_statement(expression.target, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_in_expression = function (expression, is_main, in_for) {
        if (in_for === void 0) { in_for = false; }
        var str = "".concat(in_for ? "var " : "").concat(this.compile_statement(expression.left, false), " in ").concat(this.compile_statement(expression.right, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_of_expression = function (expression, is_main, in_for) {
        if (in_for === void 0) { in_for = false; }
        var str = "".concat(in_for ? "var " : "").concat(this.compile_statement(expression.left, false), " of ").concat(this.compile_statement(expression.right, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_to_expression = function (expression, is_main) {
        this.states.libs.__to = true;
        var start = this.compile_statement(expression.start, false).raw;
        var end = this.compile_statement(expression.end, false).raw;
        var inc = this.compile_statement(expression.increment, false).raw;
        return new component_1.default("__to(".concat(start, ", ").concat(end, ", ").concat(inc, ")").concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_member_call_expression = function (expression, is_main) {
        var list = [];
        for (var i = 0; i <= expression.chain.length - 1; i++)
            list.push(this.compile_statement(expression.chain[i], false).raw);
        return new component_1.default("".concat(this.compile_statement(expression.target, false), "[").concat(list.join("]["), "]").concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_function_call_expression = function (expression, is_main, parenthesis) {
        if (parenthesis === void 0) { parenthesis = true; }
        var callee = this.compile_statement(expression.callee, false);
        var comma = this.compile_comma_expression(expression.arguments, false);
        return new component_1.default("".concat(parenthesis && !is_main ? "(" : "").concat(callee).concat(comma).concat(parenthesis && !is_main ? ")" : "").concat(is_main ? ";\n" : ""));
    };
    JavaScriptCompiler.prototype.compile_comma_expression = function (expression, is_main) {
        var args = [];
        for (var i = 0; i <= expression.expressions.length - 1; i++) {
            args.push(this.compile_statement(expression.expressions[i], false, { block_root: true }).raw);
        }
        var str = "(".concat(args.join(", "), ")");
        return new component_1.default(is_main ? "".concat(str, ";\n") : str);
    };
    JavaScriptCompiler.prototype.compile_new_expression = function (expression, is_main) {
        var str = "new ".concat(this.compile_function_call_expression(expression.target, false, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_void_expression = function (expression, is_main) {
        var str = "void ".concat(this.compile_statement(expression.value, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_conditional_expression = function (expression, is_main) {
        var condition = this.compile_statement(expression.condition, false);
        var body = this.compile_statement(expression.body, false);
        var else_body = this.compile_statement(expression.else, false);
        var str = "".concat(condition, " ? ").concat(body, " : ").concat(else_body);
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_instance_of_expression = function (expression, is_main) {
        var str = "".concat(this.compile_statement(expression.target, false), " instanceof ").concat(this.compile_statement(expression.class, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_type_of_expression = function (expression, is_main) {
        var str = "typeof ".concat(this.compile_statement(expression.target, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    JavaScriptCompiler.prototype.compile_await_expression = function (expression, is_main) {
        var str = "await ".concat(this.compile_statement(expression.target, false));
        return new component_1.default(is_main ? "".concat(str, ";\n") : "(".concat(str, ")"));
    };
    return JavaScriptCompiler;
}());
exports.default = JavaScriptCompiler;
