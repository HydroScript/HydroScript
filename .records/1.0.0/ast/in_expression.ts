import Expression from "./expression"

export default interface InExpression extends Expression {
    object: "Expression",
    kind: "InExpression",
    left: Expression,
    right: Expression
}