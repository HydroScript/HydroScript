import * as fs from "node:fs"
import { resolve } from "path"

import { compile } from "."

import prompt from "./utils/prompt"

function repl(): Promise<void> {
    const path = process.argv[2]
    const output_path = process.argv[3]

    if (path) {

        const run_path = (path: string) => {
            const input = fs.readFileSync(path, "utf-8")
            return compile(input, path)
        }

        const absolute_path = resolve(path)
        if (!output_path) console.log(`\nCompiling ${absolute_path}\n`)

        if (!fs.existsSync(absolute_path)) throw new Error(`Cannot find file in path ${absolute_path}`)

        const data = fs.statSync(absolute_path)
        if (data.isFile()) {
            const compiled = run_path(absolute_path)
            if (output_path) {
                //if (fs.existsSync(output_path)) {
                //    const confirmation = await prompt("There is already a directory/file there, are you sure you want to continue? (y/n) ")
                //    if (confirmation == "n") return
                //}
                fs.writeFileSync(output_path, compiled, { "encoding": "utf-8" })
            } else console.log(compiled)
        } else throw new Error(`Path ${absolute_path} is not a file`)

        return

    }

    console.log("\nType \".exit\" to exit")
    return (async (): Promise<void> => {
        while (true) {
            let CODE: string
            while (!CODE) CODE = await prompt("> ")
            if (CODE == ".exit") break

            try {
                console.log(compile(CODE))
            } catch (exception) {
                console.error(exception.toString())
            }
        }
    })()
}

export default repl

if (require.main == module) repl()