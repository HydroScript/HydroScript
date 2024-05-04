import StringLiteral from "../ast/string_literal"

export default function remove_quotations(value: string): [ string, string ] {
    const string = value.split("")
    const mark = string.shift() as string
    let text = ""
    while (string[0] && string[0] != mark) text += string.shift()
    return [ text, mark ]
}