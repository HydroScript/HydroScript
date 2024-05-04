import Block from "../block"
import OfExpression from "../of_expression"
import { Loop } from "./types"

export default interface ForOfLoop extends Loop {
    type: "ForOf",
    of: OfExpression,
    body: Block
}