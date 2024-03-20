import AssignmentExpression from "./assignment_expression"
import Expression from "./expression"
import Statement from "./statement"

export default interface ExportStatement extends Statement {
    object: "Statement",
    kind: "ExportStatement",
    value: Expression
}