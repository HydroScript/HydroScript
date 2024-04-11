import AssignmentExpression from "./assignment_expression"
import Statement from "./statement"

export default interface StaticPropertyDeclaration extends Statement {
    object: "Statement",
    kind: "StaticPropertyDeclaration",
    expression: AssignmentExpression
}