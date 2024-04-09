import Expression from "./expression"

export default interface BitwiseExpression extends Expression {
    object: "Expression",
    kind: "BitwiseExpression",
    left: Expression,
    right: Expression,
    operator: string
}