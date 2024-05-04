import Expression from "./expression";
import Identifier from "./identifier";

export default interface InstanceOfExpression extends Expression {
    object: "Expression",
    kind: "InstanceOfExpression",
    target: Expression,
    class: Identifier
}