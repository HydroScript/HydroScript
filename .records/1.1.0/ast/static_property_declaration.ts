import AssignmentExpression from "./assignment_expression"
import Getter from "./getter"
import Setter from "./setter"
import Statement from "./statement"

export default interface StaticPropertyDeclaration extends Statement {
    object: "Statement",
    kind: "StaticPropertyDeclaration",
    expression: AssignmentExpression | Getter | Setter
}
