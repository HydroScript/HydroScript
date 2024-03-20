import Expression from "./expression"

export default interface ObjectLiteral extends Expression {
    object: "Expression",
    kind: "ObjectLiteral",
    value: { key: string, value: any }[]
}