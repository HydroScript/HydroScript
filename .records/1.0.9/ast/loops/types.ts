import Block from "../block"

export type LoopType =
    "While" |
    "For" |
    "ForIn" |
    "ForOf"

export interface Loop {
    type: LoopType,
    body: Block
}