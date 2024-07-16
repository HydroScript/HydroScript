"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.version = exports.run = exports.repl = exports.lex = exports.parse = exports.compile = void 0;
var compiler_1 = require("./compiler");
var lexer_1 = require("./lexer");
var parser_1 = require("./parser");
var repl_1 = require("./repl");
exports.repl = repl_1.default;
var errors = require("./error");
exports.errors = errors;
var run_1 = require("./run");
function compile(CODE, path) {
    var compiler = new compiler_1.default();
    var compiled = compiler.compile(parse(CODE, path));
    return compiled;
}
exports.compile = compile;
var version = "1.1.1";
exports.version = version;
function parse(CODE, path) {
    var parser = new parser_1.default(path);
    return parser.produce(CODE);
}
exports.parse = parse;
function lex(CODE, path) {
    if (path === void 0) { path = "<unknown>"; }
    return (0, lexer_1.tokenize)(CODE, path);
}
exports.lex = lex;
function run() {
    (0, run_1.default)();
}
exports.run = run;
exports.default = {
    compile: compile,
    parse: parse,
    lex: lex,
    repl: repl_1.default,
    run: run,
    version: version,
    errors: errors
};
