import AssignmentExpression from "./assignment_expression"
import Expression from "./expression"

export default interface LocalAssignmentExpression extends Expression {
    object: "Expression",
    kind: "LocalAssignmentExpression",
    assignment: AssignmentExpression
}