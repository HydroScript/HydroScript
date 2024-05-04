import * as ChildProcess from "child_process"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"

export default function compile(argv: string[], time: number): void {
    const shell = ChildProcess.execSync
    try {
        fs.mkdirSync(`${os.tmpdir()}\\HydroScript`)
    } catch (e) {}
    const output_path = `${os.tmpdir()}\\HydroScript\\hydroscript-execute-${time}.js`
    
    const absolute_path = path.resolve(argv[2])
    if (!fs.existsSync(absolute_path)) throw new Error(`Cannot find file in path ${absolute_path}`)
    shell(`npx hydroscript "${absolute_path}" "${output_path}"`)

    try {
        const log = [
            `SourcePath: ${absolute_path}`,
            `OutputPath: ${output_path}`,
            `Time: ${new Date(time)}`,
            `AbsoluteTime: ${time}`
        ].join("\n")
        fs.writeFileSync(`${os.tmpdir()}\\HydroScript\\hydroscript-execute-${time}.log`, log)
    } catch (e) {}

    return
}