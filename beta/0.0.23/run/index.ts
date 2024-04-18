import * as ChildProcess from "child_process"
import compile from "./compile"
import execute from "./execute"
import delete_ from "./delete"
import HydroScriptExecuteError from "../error/execute"

export default function run(): void {
    const shell = ChildProcess.execSync

    if (!process.argv[2]) throw new HydroScriptExecuteError("File was not specified")
    try {
        shell("node -v")
    } catch (e) {
        throw new HydroScriptExecuteError("Cannot find Node.js executable")
    }

    const time = Date.now()
    compile(process.argv, time)
    execute(process.argv, time)
    delete_(time)
    return
}