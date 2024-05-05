import Block from "./block"
import Identifier from "./identifier"
import Statement from "./statement"

export default interface Getter extends Statement {
    object: "Statement",
    kind: "Getter",
    name: Identifier,
    body: Block
}