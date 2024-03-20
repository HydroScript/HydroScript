import { TokenType } from "../lexer/token_type"
import HydroScriptInternalError from "./internal"

class HydroScriptSyntaxError extends Error {
    public name = "HydroScriptSyntaxError"

    constructor(expected: null | TokenType | TokenType[], got: TokenType | string) {
        let message: string
        if (expected == null)
            message = `Unexpected token ${TokenType[got] ?? got} (${got})`
        else if (typeof expected == "number" && typeof got == "number")
            message = `Expected ${TokenType[expected]} (${expected}), got ${TokenType[got]} (${got})`
        else if (typeof expected == "object" && typeof got == "number")
            message = `Expected ${expected.map(v => TokenType[v]).join(" or ")} (${expected.map(v => String(v)).join(" or ")}), got ${TokenType[got]} (${got})`
        else throw new HydroScriptInternalError(`HydroScriptSyntaxError creation failed: invalid parameters`)
        super(message)
    }
}

export default HydroScriptSyntaxError