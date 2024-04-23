import Expression from "./expression"

export default interface BinaryExpression extends Expression {
    object: "Expression",
    kind: "BinaryExpression",
    left: Expression,
    right: Expression,
    operator: string
}