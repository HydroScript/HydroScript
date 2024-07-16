import Expression from "./expression"

export default interface ArrayLiteral extends Expression {
    object: "Expression",
    kind: "ArrayLiteral",
    value: Expression[]
}