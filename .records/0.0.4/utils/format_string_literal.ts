import StringLiteral from "../ast/string_literal";

export default function format_string_literal(literal: StringLiteral): string {
    return `${literal.mark}${literal.value}${literal.mark}`
}