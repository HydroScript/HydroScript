import Expression from "./expression"
import Statement from "./statement"

export default interface ExistentialStatement extends Statement {
    object: "Statement",
    kind: "ExistentialStatement",
    statement: Statement,
    condition: Expression
}