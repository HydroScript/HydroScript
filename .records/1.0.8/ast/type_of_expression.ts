import Expression from "./expression"

export default interface TypeOfExpression extends Expression {
    object: "Expression",
    kind: "TypeOfExpression",
    target: Expression
}