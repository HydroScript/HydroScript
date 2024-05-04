import Statement from "./statement"

export default interface Program extends Statement {
    object: "Program"
    kind: "Program",
    body: Statement[]
}