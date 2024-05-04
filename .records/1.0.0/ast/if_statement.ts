import Block from "./block"
import Expression from "./expression"
import Statement from "./statement"

export default interface IfStatement extends Statement {
    object: "Statement",
    kind: "IfStatement",
    condition: Expression,
    body: Block,
    else: Block | null
}