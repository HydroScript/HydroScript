import Expression from "./expression"

export default interface BitwiseNotExpression extends Expression {
    object: "Expression",
    kind: "BitwiseNotExpression",
    target: Expression
}