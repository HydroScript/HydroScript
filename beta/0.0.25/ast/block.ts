import Statement from "./statement"

export default interface Block extends Statement {
    object: "Statement",
    kind: "Block",
    body: Statement[]
}