import Identifier from "./identifier"
import Statement from "./statement"
import AssignmentExpression from "./assignment_expression"
import FunctionLiteral from "./function_literal"
import StaticPropertyDeclaration from "./static_property_declaration"
import Getter from "./getter"
import Setter from "./setter"

export default interface ClassBlock extends Statement {
    object: "Statement",
    kind: "ClassBlock",
    statics: StaticPropertyDeclaration[],
    constructor: FunctionLiteral | null,
    initializers: Identifier[],
    definitions: AssignmentExpression[]
    getters: Getter[],
    setters: Setter[]
}