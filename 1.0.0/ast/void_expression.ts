import Expression from "./expression"

export default interface VoidExpression extends Expression {
    object: "Expression",
    kind: "VoidExpression",
    value: Expression
}