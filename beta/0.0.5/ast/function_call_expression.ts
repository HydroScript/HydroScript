import { Token } from "../lexer"
import Expression from "./expression"

export default interface FunctionCallExpression extends Expression {
    object: "Expression",
    kind: "FunctionCallExpression",
    callee: Expression,
    arguments: Expression[]
}