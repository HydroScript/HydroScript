import operators from "../data/operators"
import skippables from "../data/skippable"
import { TokenType } from "./token_type"

import { HydroScriptSyntaxError } from "../error"
import { tokenToString } from "typescript"
import throw_error from "../utils/throw"

export interface Token {
    object: "Token",
    value: string,
    type: TokenType,
    line: number,
    column: number
}

export function is_alpha(src: string): boolean {
    return src.toUpperCase() != src.toLowerCase()
}

export function can_use_in_indentifier(src: string): boolean {
    return is_alpha(src) || is_int(src) || src == "_" || src == "$"
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

export function token(value: string = "", type: TokenType, line: number, column: number): Token {
    return {
        object: "Token",
        type,
        value,
        line,
        column
    } as Token
}

export function tokenize(code: string, path: string): Token[] {
    const tokens: Token[] = []
    const sources: string[][] = code.split("\n").map(v => v.split(""))

    for (let i = 1; i <= sources.length; i++) {
        const source = [ ...sources[i - 1] ]

        const getColumn = () => sources[i - 1].length - source.length + 1
        while (source.length > 0) {
            if (is_skippable(source[0])) {
    
                source.shift()
    
            } else if (can_use_in_indentifier(source[0]) && !is_int(source[0])) {

                const column = getColumn()
    
                let identifier = ""
                while (source.length > 0 && can_use_in_indentifier(source[0])) identifier += source.shift()
                tokens.push(token(identifier, TokenType.Identifier, i, column))
                while (is_skippable(source[0])) source.shift()
                if (source[0] == ".") tokens.push(token(source.shift(), TokenType.Dot, i, column))
    
            } else if (is_int(source[0]) || source[0] == ".") {

                const column = getColumn()
    
                let num = ""
                let is_decimal = false
                while (source.length > 0 && (is_int(source[0]) || (!is_decimal && source[0] == "."))) {
                    if (!is_decimal && source[0] == ".") is_decimal = true
                    num += source.shift()
                }
                if (num == ".") tokens.push(token(num, TokenType.Dot, i, column))
                else tokens.push(token(`${num.startsWith(".") ? "0" : ""}${num}`, TokenType.Number, i, column))
    
            } else if (source[0] == "\"" || source[0] == "'") {
                
                const column = getColumn()
    
                const mark = source.shift() as string
                let text = mark
                while (source[0] && source[0] != mark) {
                    const current = source.shift()
                    if (current == "\n") throw_error(new HydroScriptSyntaxError(TokenType.QuotationMark, "\\n", path, i, column))
                    if (current == "\\") text += `\\${source.shift() ?? ""}`
                    else text += current
                }
                if (!source[0]) throw_error(new HydroScriptSyntaxError(null, TokenType.FileEnd, path, i, column))
                const end = source.shift()
                tokens.push(token(text + end, TokenType.String, i, column))
    
            } else if (source[0] + source[1] == "//") {
    
                while (source[0] && source[0] != "\n") source.shift()
    
            } else {

                const column = getColumn()
    
                let op = ""
                while (source.length > 0 && is_operator(source[0])) {
                    if (!Object.keys(operators).some(key => key.startsWith(op + source[0]))) break
                    op += source.shift()
                }
                const type = operators[op]
                if (!type) throw_error(new HydroScriptSyntaxError(null, op, path, i, column))
                tokens.push(token(op, type, i, column))
    
            }
        }
    }

    tokens.push(token(undefined, TokenType.FileEnd, sources.length, sources[sources.length - 1].length + 1))
    return tokens
}