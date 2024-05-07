import Block from "../block"
import InExpression from "../in_expression"
import { Loop } from "./types"

export default interface ForInLoop extends Loop {
    type: "ForIn",
    in: InExpression,
    body: Block
}