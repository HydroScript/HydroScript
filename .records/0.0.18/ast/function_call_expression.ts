import { Token } from "../lexer"
import CommaExpression from "./comma_expression"
import Expression from "./expression"

export default interface FunctionCallExpression extends Expression {
    object: "Expression",
    kind: "FunctionCallExpression",
    callee: Expression,
    arguments: CommaExpression
}