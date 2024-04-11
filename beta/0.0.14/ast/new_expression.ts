import Expression from "./expression"
import FunctionCallExpression from "./function_call_expression"

export default interface NewExpression extends Expression {
    object: "Expression",
    kind: "NewExpression",
    target: FunctionCallExpression
}