import Block from "./block"
import Identifier from "./identifier"
import Statement from "./statement"

export default interface TryStatement extends Statement {
    object: "Statement",
    kind: "TryStatement",
    try: Block,
    catch: {
        identifier: Identifier,
        body: Block
    } | null,
    finally: Block | null
}