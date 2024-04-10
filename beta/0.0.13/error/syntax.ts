import { Token } from "../lexer"
import { TokenType } from "../lexer/token_type"
import HydroScriptInternalError from "./internal"
import * as fs from "node:fs"
import { version } from ".."

class HydroScriptSyntaxError extends Error {
    public name = "HydroScriptSyntaxError"
    private _path: string = "<unknown>"
    private _line: number
    private _column: number
    public _display: string

    constructor(expected: null | TokenType | TokenType[], got: TokenType | string, path: string, line?: number, column?: number, token?: Token) {
        let message: string
        if (expected == null)
            message = `Unexpected token ${TokenType[got] ?? got} (${got})`
        else if (typeof expected == "number" && typeof got == "number")
            message = `Expected ${TokenType[expected]} (${expected}), got ${TokenType[got]} (${got})`
        else if (typeof expected == "object" && typeof got == "number")
            message = `Expected ${expected.map(v => TokenType[v]).join(" or ")} (${expected.map(v => String(v)).join(" or ")}), got ${TokenType[got]} (${got})`
        else throw new HydroScriptInternalError(`HydroScriptSyntaxError creation failed: invalid parameters`)
        super(message)
        
        this._path = path
        if (line) {
            this._line = line
            this._column = column
            const stack = [ this.stack.split("\n")[0] ]
            stack.push(`    at <unknown> (${path}:${line}:${column})`)
            this.stack = stack.join("\n")
        }

        this._display = ((): string => {
            if (!this._path || this._path == "<unknown>") return "\n" + this.stack + `\n\nHydroScript v${version}\n`
        
            const error_line = fs.readFileSync(this._path, "utf-8").split("\n")[this._line - 1]
            const start = Math.max(0, this._column - 30)
            const end = Math.min(error_line.length, this._column + 30)
            const shifted = error_line.length != end - start

            const display = [
                `${shifted ? "      " : ""}${error_line.substring(start, end)}`,
                (shifted ? "      " : "") + " ".repeat(this._column - 1 - start) + "^",
                "",
                ...this.stack.split("\n")
            ]
            return "\n" + display.join("\n") + `\n\nHydroScript v${version}\n`
        })()
    }

    toString() {
        return this._display
    }
}

export default HydroScriptSyntaxError