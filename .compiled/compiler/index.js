"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_item_1 = require("../utils/get_item");
var js_1 = require("./js");
var error_1 = require("../error");
var Compiler = (function () {
    function Compiler() {
    }
    Compiler.prototype.compile = function (program) {
        var _a;
        this.program = program;
        var option = ((_a = (0, get_item_1.default)(program.options.value, "to")) !== null && _a !== void 0 ? _a : {
            object: "Expression",
            kind: "StringLiteral",
            mark: "\"",
            value: "javascript"
        });
        if (option.kind != "StringLiteral")
            throw new error_1.HydroScriptCompileError("\"to\" option is not a StringLiteral");
        var final_option = option;
        final_option.value = final_option.value.toLowerCase();
        if (!Compiler.languages.includes(final_option.value))
            throw new error_1.HydroScriptCompileError("\"to\" option is not valid");
        switch (final_option.value) {
            case "javascript": {
                this.compiler = new js_1.default();
                break;
            }
            default:
                throw new error_1.HydroScriptInternalError("Language not implemented");
        }
        return this.compiler.compile(this.program);
    };
    Compiler.languages = [
        "javascript"
    ];
    return Compiler;
}());
exports.default = Compiler;
