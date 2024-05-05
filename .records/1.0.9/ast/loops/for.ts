import Block from "../block"
import Expression from "../expression"
import { Loop } from "./types"

export default interface ForLoop extends Loop {
    type: "For",
    initialize: Expression,
    condition: Expression,
    afterthought: Expression,
    body: Block
}