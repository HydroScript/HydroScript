import Block from "./block"
import Expression from "./expression"
import Identifier from "./identifier"

export default interface FunctionLiteral extends Expression {
    object: "Expression",
    kind: "FunctionLiteral",
    parameters: Identifier[],
    body: Block,
    async: boolean
}