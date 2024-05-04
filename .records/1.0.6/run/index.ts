import * as ChildProcess from "child_process"
import * as fs from "fs"
import HydroScriptExecuteError from "../error/execute"
import { compile } from "../index"
import throw_error from "../utils/throw"

export default function run(): void {
    const time = Date.now()
    const path = process.argv[2]
    const output_path = `${path}\\.\\hydroscript-execute-${time}.js`

    if (!path) throw new HydroScriptExecuteError("No file path specified")
    try {
        fs.writeFileSync(output_path, compile(fs.readFileSync(path, "utf-8"), path))
    } catch (error) {
        throw_error(error)
    }

    const cp = ChildProcess.fork(output_path, {
        stdio: "inherit"
    })
    cp.on("error", error => {
        throw new HydroScriptExecuteError(error.stack ?? error.message)
    })
    cp.on("exit", () => fs.unlinkSync(output_path))
}