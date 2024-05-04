import * as fs from "fs"
import * as os from "os"

export default function delete_(time: number): void {
    if (!fs.existsSync(`${os.tmpdir()}\\HydroScript\\hydroscript-execute-${time}.js`)) return
    fs.unlinkSync(`${os.tmpdir()}\\HydroScript\\hydroscript-execute-${time}.js`)
}