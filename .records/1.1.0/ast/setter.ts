import Block from "./block"
import Identifier from "./identifier"
import Statement from "./statement"

export default interface Setter extends Statement {
    object: "Statement",
    kind: "Setter",
    name: Identifier,
    parameter: Identifier,
    body: Block
}