import Expression from "./expression"

export default interface Identifier extends Expression {
    object: "Expression",
    kind: "Identifier",
    symbol: string
}