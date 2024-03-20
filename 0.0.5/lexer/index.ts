import operators from "../data/operators"
import skippables from "../data/skippable"
import { TokenType } from "./token_type"

import { HydroScriptSyntaxError } from "../error"

export interface Token {
    object: "Token",
    value: string,
    type: TokenType,
    line: number
}

export function is_alpha(src: string): boolean {
    return src.toUpperCase() != src.toLowerCase()
}

export function can_use_in_indentifier(src: string): boolean {
    return is_alpha(src) || is_int(src) || src == "_"
}

export function is_int(src: string): boolean {
    const char = src.charCodeAt(0)
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)]
    return (char >= bounds[0] && char <= bounds[1])
}

export function is_operator(src: string): boolean {
    return !is_int(src) && !is_alpha(src) && !is_skippable(src)
}

export function is_skippable(src: string): boolean {
    return skippables[src] ? true : false
}

export function token(value: string = "", type: TokenType, line: number): Token {
    return {
        object: "Token",
        type,
        value,
        line
    } as Token
}

export function tokenize(code: string): Token[] {
    const tokens: Token[] = []
    const source: string[] = code.split("")

    let line = 1

    while (source.length > 0) {
        if (is_skippable(source[0])) {

            if (source[0] == "\n") line++
            source.shift()

        } else if (is_alpha(source[0])) {

            let identifier = ""
            while (source.length > 0 && can_use_in_indentifier(source[0])) identifier += source.shift()
            tokens.push(token(identifier, TokenType.Identifier, line))
            while (is_skippable(source[0])) source.shift()
            if (source[0] == ".") tokens.push(token(source.shift(), TokenType.Dot, line))

        } else if (is_int(source[0]) || source[0] == ".") {

            let num = ""
            let is_decimal = false
            while (source.length > 0 && (is_int(source[0]) || (!is_decimal && source[0] == "."))) {
                if (!is_decimal && source[0] == ".") is_decimal = true
                num += source.shift()
            }
            if (num == ".") tokens.push(token(num, TokenType.Dot, line))
            else tokens.push(token(`${num.startsWith(".") ? "0" : ""}${num}`, TokenType.Number, line))

        } else if (source[0] == "\"" || source[0] == "'") {

            const mark = source.shift() as string
            let text = mark
            while (source[0] && source[0] != mark) text += source.shift()
            if (!source[0]) throw new HydroScriptSyntaxError(null, TokenType.FileEnd)
            const end = source.shift()
            tokens.push(token(text + mark, TokenType.String, line))

        } else if (source[0] + source[1] == "//") {

            while (source[0] && source[0] != "\n") source.shift()

        } else {

            let op = ""
            while (source.length > 0 && is_operator(source[0])) {
                if (!Object.keys(operators).some(key => key.startsWith(op + source[0]))) break
                op += source.shift()
            }
            const type = operators[op]
            if (!type) throw new HydroScriptSyntaxError(null, op)
            tokens.push(token(op, type, line))

        }
    }

    tokens.push(token(undefined, TokenType.FileEnd, line))
    return tokens
}