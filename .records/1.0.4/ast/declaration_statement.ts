import Expression from "./expression"
import Identifier from "./identifier"
import Statement from "./statement"

export default interface DeclarationStatement extends Statement {
    object: "Statement",
    kind: "DeclarationStatement",
    target: Identifier,
    value: Expression
}