import Compiler from "./compiler"
import { tokenize } from "./lexer"
import Parser from "./parser"
import repl from "./repl"

function compile(CODE: string) {
    const compiler = new Compiler()
    const compiled = compiler.compile(parse(CODE))
    return compiled
}
const version = "0.0.8"
function parse(CODE: string) {
    const parser = new Parser()
    return parser.produce(CODE)
}
function lex(CODE: string) {
    return tokenize(CODE)
}

export {
    compile,
    parse,
    lex,
    repl,
    version
}