import Expression from "./expression"

export default interface UnaryExpression extends Expression {
    object: "Expression",
    kind: "UnaryExpression"
    sign: "+" | "-",
    value: Expression
}