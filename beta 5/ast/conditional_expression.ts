import Expression from "./expression"

export default interface ConditionalExpression extends Expression {
    object: "Expression",
    kind: "ConditionalExpression",
    condition: Expression,
    body: Expression,
    else: Expression
}