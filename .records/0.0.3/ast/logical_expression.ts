import Expression from "./expression"

export default interface LogicalExpression extends Expression {
    object: "Expression",
    kind: "LogicalExpression",
    left: Expression,
    right: Expression,
    operator: string
}