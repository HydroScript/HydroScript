import * as ChildProcess from "child_process"
import * as os from "os"

export default function execute(argv: string[], time: number): void {
    const shell = ChildProcess.execSync
    const path = os.tmpdir()
    shell(`node "${path}\\HydroScript\\hydroscript-execute-${time}.js"`, { stdio: "inherit" })
    return
}