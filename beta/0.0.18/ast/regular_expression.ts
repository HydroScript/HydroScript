import Expression from "./expression"

export default interface RegularExpression extends Expression {
    object: "Expression",
    kind: "RegularExpression",
    value: string
}