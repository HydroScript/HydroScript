import Expression from "./expression"

export default interface MemberCallExpression extends Expression {
    object: "Expression",
    kind: "MemberCallExpression",
    target: Expression,
    chain: Expression[]
}