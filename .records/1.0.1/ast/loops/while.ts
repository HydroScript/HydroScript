import Block from "../block"
import Expression from "../expression"
import { Loop } from "./types"

export default interface WhileLoop extends Loop {
    type: "While",
    condition: Expression,
    body: Block
}