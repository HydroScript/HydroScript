import fs from "node:fs"
import { resolve } from "path"

import Compiler from "./compiler"
import Parser from "./parser"

import prompt from "./utils/prompt"

async function repl(): Promise<void> {
    const path = process.argv[2]
    const output_path = process.argv[3]

    const parser = new Parser()
    const compiler = new Compiler()

    if (path) {

        const run_path = (path: string) => {
            const input = fs.readFileSync(path, "utf-8")
            const program = parser.produce(input)
            const result = compiler.compile(program)
            return result
        }

        const absolute_path = resolve(process.argv[2])
        if (!output_path) console.log(`\nRunning ${absolute_path}\n`)

        if (!fs.existsSync(absolute_path)) throw new Error(`Cannot find file in path ${absolute_path}`)

        const data = fs.statSync(absolute_path)
        if (data.isFile()) {
            const compiled = run_path(absolute_path)
            if (output_path) {
                if (fs.existsSync(output_path)) {
                    const confirmation = await prompt("There is already a directory/file there, are you sure you want to continue? (y/n) ")
                    if (confirmation == "n") return
                }
                fs.writeFileSync(output_path, compiled, { "encoding": "utf-8" })
            } else console.log(compiled)
        } else throw new Error(`Path ${absolute_path} is not a file`)

        return

    }

    console.log("\nHydroScript Repl v1.2\nTo exit, type .exit")
    while (true) {
        let CODE
        while (!CODE) CODE = await prompt("> ")
        if (CODE == ".exit") break

        try {
            const program = parser.produce(CODE)
            const program_string = JSON.stringify(program, null, 2)
            console.log(program_string)
            const compiled = compiler.compile(program)
            console.log(compiled)
        } catch (exception) {
            console.log(exception)
        }
    }
}

if (require.main == module) repl()

export {
    repl
}