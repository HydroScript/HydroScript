import Statement from "./statement"

export default interface BreakStatement extends Statement {
    object: "Statement",
    kind: "BreakStatement"
}