import ObjectLiteral from "./object_literal"
import Statement from "./statement"

export default interface OptionsStatement extends Statement {
    object: "Statement",
    kind: "OptionsStatement",
    options: ObjectLiteral
}