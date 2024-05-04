import ClassBlock from "./class_block"
import Expression from "./expression"
import Identifier from "./identifier"

export default interface ClassLiteral extends Expression {
    object: "Expression",
    kind: "ClassLiteral",
    extends: Expression | null,
    definition: ClassBlock
}