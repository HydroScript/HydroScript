import Block from "../ast/block"
import ClassBlock from "../ast/class_block"
import Identifier from "../ast/identifier"
import ImportStatement from "../ast/import_statement"
import ObjectLiteral from "../ast/object_literal"
import Program from "../ast/program"
import Statement from "../ast/statement"
import StringLiteral from "../ast/string_literal"
import ReturnStatement from "../ast/return_statement"
import IfStatement from "../ast/if_statement"
import NumericLiteral from "../ast/numeric_literal"

import format_indents from "../utils/format_indents"
import format_string_literal from "../utils/format_string_literal"

import { format_parsing_error, HydroScriptCompileError, HydroScriptInternalError } from "../error"
import AssignmentExpression from "../ast/assignment_expression"

export default class PythonCompiler {
    private imports: [Identifier, StringLiteral][]
    private options: ObjectLiteral
    
    public compile(program: Program): string {
        this.imports = []
        this.options = program.options

        let result: string = ""
        for (let i = 0; i <= program.body.length - 1; i++) {
            const statement = program.body[i]
            result += this.compile_statement(statement, 0)
        }

        let imports: string[] = []
        for (const importing of this.imports) {
            imports.push(`import ${format_string_literal(importing[1])} as ${importing[0].symbol}`)
        }
        imports.push("")
        
        return result
    }

    private compile_statement(statement: Statement, indents: number = 0): string {

        switch (statement.kind) {

            case "Program":
                return this.compile(statement as Program)
            case "Block":
                return this.compile_block(statement as Block, indents)
            //case "ClassBlock":
            //    return this.compile_class_block(statement as ClassBlock, indents)

            case "ImportStatement":
                return this.compile_import_statement(statement as ImportStatement, indents)
            case "ReturnStatement":
                return this.compile_return_statement(statement as ReturnStatement, indents)

            case "IfStatement":
                return this.compile_if_statement(statement as IfStatement, indents)

            case "NumericLiteral":
                return this.compile_numeric_literal(statement as NumericLiteral, indents)
            case "Identifier":
                return this.compile_identifier(statement as Identifier, indents)

            case "AssignmentExpression":
                return this.compile_assignment_expression(statement as AssignmentExpression, indents)

            default:
                throw new HydroScriptInternalError(`Statement kind ${statement.kind} is not yet implemented in the Python compiler`)

        }

    }

    private compile_block(statement: Block, indents: number): string {
        let result: string = ""
        for (let i = 0; i <= statement.body.length - 1; i++) {
            const current = statement.body[i]
            result += this.compile_statement(current, indents + 1)
        }
        return result
    }

    private compile_class_block(statement: ClassBlock, indents: number) {

    }

    private compile_import_statement(statement: ImportStatement, indents: number): string {
        if (indents != 0) throw new HydroScriptCompileError("ImportStatement is not on top-level scope")
        this.imports.push([statement.target, statement.path])
        return ""
    }

    private compile_return_statement(statement: ReturnStatement, indents: number): string {
        return `${format_indents(indents)}return ${this.compile_statement(statement.value)}\n`
    }

    private compile_if_statement(statement: IfStatement, indents: number): string {
        const condition = this.compile_statement(statement.condition)
        const body = this.compile_block(statement.body, indents)

        const result = [
            `if ${condition}:\n`,
            body
        ]
        if (statement.else) result.push(`else:\n`, this.compile_block(statement.else, indents))
        return result.map((v: string) => `${format_indents(indents)}${v}`).join("")
    }

    private compile_numeric_literal(expression: NumericLiteral, indents: number): string {
        return `${format_indents(indents)}${expression.value}`
    }

    private compile_identifier(expression: Identifier, indents: number): string {
        return `${format_indents(indents)}${expression.symbol}${indents != 0 ? "\n": ""}`
    }

    private compile_assignment_expression(expression: AssignmentExpression, indents: number): string {
        if (expression.left.kind != "Identifier"
        && expression.left.kind != "MemberCallExpression") throw new HydroScriptCompileError(`Left side of AssignmentExpression: ${format_parsing_error([ "StringLiteral", "MemberCallExpression" ], expression.left.kind)}`)
        return `${format_indents(indents)}${this.compile_statement(expression.left)} ${expression.operator} ${this.compile_statement(expression.right)}\n`
    }

}