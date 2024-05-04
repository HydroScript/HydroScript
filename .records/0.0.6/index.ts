import Compiler from "./compiler"
import Parser from "./parser"
import repl from "./repl"

function compile(CODE: string) {
    const parser = new Parser()
    const compiler = new Compiler()

    const program = parser.produce(CODE)
    const compiled = compiler.compile(program)
    return compiled
}
const version = "0.0.6"
function parse(CODE: string) {
    const parser = new Parser()
    return parser.produce(CODE)
}

export {
    compile,
    parse,
    repl,
    version
}