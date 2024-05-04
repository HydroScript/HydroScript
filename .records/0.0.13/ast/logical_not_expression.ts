import Expression from "./expression"

export default interface LogicalNotExpression extends Expression {
    object: "Expression",
    kind: "LogicalNotExpression",
    target: Expression
}