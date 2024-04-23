import Block from "./block"
import Expression from "./expression"
import { Loop } from "./loops/types"
import Statement from "./statement"

export default interface LoopStatement extends Statement {
    object: "Statement",
    kind: "LoopStatement",
    loop: Loop
}