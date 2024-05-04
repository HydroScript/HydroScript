import Expression from "./expression"
import Identifier from "./identifier"

export default interface OfExpression extends Expression {
    object: "Expression",
    kind: "OfExpression",
    left: Identifier,
    right: Expression
}