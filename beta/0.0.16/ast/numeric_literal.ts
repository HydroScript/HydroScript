import Expression from "./expression"

export default interface NumericLiteral extends Expression {
    object: "Expression",
    kind: "NumericLiteral",
    value: string
}