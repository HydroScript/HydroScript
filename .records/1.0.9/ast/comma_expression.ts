import Expression from "./expression";

export default interface CommaExpression extends Expression {
    object: "Expression",
    kind: "CommaExpression",
    expressions: Expression[]
}