import Statement from "./statement"

export default interface ContinueStatement extends Statement {
    object: "Statement",
    kind: "ContinueStatement"
}