import Identifier from "./identifier"
import Statement from "./statement"
import StringLiteral from "./string_literal"

export default interface ImportStatement extends Statement {
    object: "Statement",
    kind: "ImportStatement",
    target: Identifier,
    path: StringLiteral
}