import Expression from "./expression"
import Identifier from "./identifier"
import MemberCallExpression from "./member_call_expression"
import NumericLiteral from "./numeric_literal"

export default interface ToExpression extends Expression {
    object: "Expression",
    kind: "ToExpression",
    start: NumericLiteral | Identifier | MemberCallExpression,
    end: NumericLiteral | Identifier | MemberCallExpression,
    increment: NumericLiteral | Identifier | MemberCallExpression
}