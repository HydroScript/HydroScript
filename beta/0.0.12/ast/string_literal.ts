import Expression from "./expression"

export default interface StringLiteral extends Expression {
    object: "Expression",
    kind: "StringLiteral",
    mark: "\"" | "'",
    value: string
}