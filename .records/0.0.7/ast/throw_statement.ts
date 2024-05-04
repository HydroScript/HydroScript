import Expression from "./expression"
import Statement from "./statement"

export default interface ThrowStatement extends Statement {
    object: "Statement",
    kind: "ThrowStatement",
    value: Expression
}