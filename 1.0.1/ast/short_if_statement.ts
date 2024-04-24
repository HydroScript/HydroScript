import Expression from "./expression"
import Statement from "./statement"

export default interface ShortIfStatement extends Statement {
    object: "Statement",
    kind: "ShortIfStatement",
    statement: Statement,
    else: Statement | null,
    condition: Expression
}