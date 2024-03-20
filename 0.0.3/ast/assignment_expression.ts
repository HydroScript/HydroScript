import Expression from "./expression"

export default interface AssignmentExpression extends Expression {
    object: "Expression",
    kind: "AssignmentExpression",
    left: Expression,
    right: Expression,
    operator: string
}