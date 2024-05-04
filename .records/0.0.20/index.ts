import Program from "./ast/program"
import Compiler from "./compiler"
import { tokenize } from "./lexer"
import Parser from "./parser"
import repl from "./repl"
import * as errors from "./error"

import run_ from "./run"

function compile(CODE: string, path?: string): string {
    const compiler = new Compiler()
    const compiled = compiler.compile(parse(CODE, path) as Program)
    return compiled
}

const version = "0.0.20"

function parse(CODE: string, path?: string): {
    object: "Program"
    kind: "Program",
    body: Record<string, any>[],
    options: {
        object: "Expression",
        kind: "ObjectLiteral",
        value: { key: string, value: any }[]
    }
} {
    const parser = new Parser(path)
    return parser.produce(CODE)
}


function lex(CODE: string, path: string = "<unknown>"): {
    object: "Token",
    value: string,
    type: number,
    line: number
}[] {
    return tokenize(CODE, path)
}

function run(): void {
    run_()
}

export {
    compile,
    parse,
    lex,
    repl,
    run,
    version,
    errors
}
export default {
    compile,
    parse,
    lex,
    repl,
    run,
    version,
    errors
}