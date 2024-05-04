import Expression from "./expression"

export default interface AwaitExpression extends Expression {
    object: "Expression",
    kind: "AwaitExpression",
    target: Expression
}