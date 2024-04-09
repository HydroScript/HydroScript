import Program from "./ast/program"
import Compiler from "./compiler/js"
import { tokenize } from "./lexer"
import Parser from "./parser"
import repl from "./repl"

function compile(CODE: string) {
    const compiler = new Compiler()
    const compiled = compiler.compile(parse(CODE) as Program)
    return compiled
}
const version = "0.0.10"
function parse(CODE: string): {
    object: "Program"
    kind: "Program",
    body: Record<string, any>[],
    options: {
        object: "Expression",
        kind: "ObjectLiteral",
        value: { key: string, value: any }[]
    }
} {
    const parser = new Parser()
    return parser.produce(CODE)
}
function lex(CODE: string): {
    object: "Token",
    value: string,
    type: number,
    line: number
}[] {
    return tokenize(CODE)
}

export {
    compile,
    parse,
    lex,
    repl,
    version
}