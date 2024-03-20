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

export {
    compile,
    repl
}