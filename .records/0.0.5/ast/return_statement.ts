import Expression from "./expression"
import Statement from "./statement"

export default interface ReturnStatement extends Statement {
    object: "Statement",
    kind: "ReturnStatement",
    value: Expression
}