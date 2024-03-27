import Expression from "./expression"

export default interface ComparisonExpression extends Expression {
    object: "Expression",
    kind: "ComparisonExpression",
    left: Expression,
    right: Expression,
    operator: string
}