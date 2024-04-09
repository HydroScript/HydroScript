import BinaryExpression from "../ast/binary_expression"
import ComparisonExpression from "../ast/comparison_expression"
import NumericLiteral from "../ast/numeric_literal"
import ObjectLiteral from "../ast/object_literal"
import AssignmentExpression from "../ast/assignment_expression"
import Program from "../ast/program"
import Statement from "../ast/statement"
import LogicalExpression from "../ast/logical_expression"
import LogicalNotExpression from "../ast/logical_not_expression"
import BitwiseExpression from "../ast/bitwise_expression"
import Identifier from "../ast/identifier"
import MemberCallExpression from "../ast/member_call_expression"
import StringLiteral from "../ast/string_literal"
import ImportStatement from "../ast/import_statement"
import Block from "../ast/block"
import IfStatement from "../ast/if_statement"
import AwaitExpression from "../ast/await_expression"
import BitwiseNotExpression from "../ast/bitwise_not_expression"
import WhileStatement from "../ast/while_statement"
import InstanceOfExpression from "../ast/instance_of_expression"
import TypeOfExpression from "../ast/type_of_expression"
import FunctionCallExpression from "../ast/function_call_expression"
import Expression from "../ast/expression"
import ClassLiteral from "../ast/class_literal"
import ClassBlock from "../ast/class_block"
import StaticPropertyDeclaration from "../ast/static_property_declaration"
import FunctionLiteral from "../ast/function_literal"
import ConditionalExpression from "../ast/conditional_expression"
import NewExpression from "../ast/new_expression"
import ReturnStatement from "../ast/return_statement"
import ThrowStatement from "../ast/throw_statement"
import ArrayLiteral from "../ast/array_literal"
import CommaExpression from "../ast/comma_expression"

import format_string_literal from "../utils/format_string_literal"
import list_to_dict_string from "../utils/list_to_dict_string"
import { add_suffix } from "../utils/is_reserved"
import get_item from "../utils/get_item"

import { HydroScriptInternalError, HydroScriptCompileError, format_parsing_error } from "../error"

export default class JavaScriptCompiler {
    private imports: [Identifier, StringLiteral][]
    private export: Expression | null = null
    private variables: string[] = []

    private options: ObjectLiteral

    compile(program: Program): string {

        this.imports = []
        this.export = null
        this.variables = []
        
        this.options = program.options

        let result: string = ""
        for (let i = 0; i <= program.body.length - 1; i++) {
            const statement = program.body[i]
            result += this.compile_statement(statement, true, { block_root: true, global_scope: true })
        }
        if (result != "") result += "\n"

        let variables = ""

        if (this.variables.length != 0) variables = `var ${[...new Set(this.variables)].join(", ")};\n`
        let imports: string[] = []
        for (const importing of this.imports) {
            imports.push(`import ${importing[0].symbol} from ${format_string_literal(importing[1])};`)
        }
        imports.push("")

        const defaults = {
            object: "Expression",
            kind: "Identifier",
            symbol: "true"
        } as Identifier
        const strict_option = (get_item(this.options.value, "strict") ?? defaults) as Identifier
        if (strict_option.kind != "Identifier" || (strict_option.symbol != "true" && strict_option.symbol != "false")) throw new HydroScriptCompileError("\"strict\" option is not a valid numeric literal")
        const strict = strict_option.symbol == "true"

        return [
            strict ? "\"use strict\";\n" : "",
            imports.join("\n"),
            `${variables}`,
            result,
            this.export ? `\nexport default ${this.compile_statement(this.export, true, { block_root: true })}` : ""
        ].join("")

    }

    compile_statement(statement: Statement, is_main: boolean, options?: Record<string, any>): string {

        switch (statement.kind) {
            case "Program":
                return this.compile(statement as Program)
            case "Block":
                return this.compile_block(statement as Block, is_main)
            case "ClassBlock":
                return this.compile_class_block(statement as ClassBlock)

            case "ImportStatement":
                return this.compile_import_statement(statement as ImportStatement)
            case "ReturnStatement":
                return this.compile_return_statement(statement as ReturnStatement, (options ?? {}).global_scope ?? false)

            case "ThrowStatement":
                return this.compile_throw_statement(statement as ThrowStatement)

            case "IfStatement":
                return this.compile_if_statement(statement as IfStatement)
            case "WhileStatement":
                return this.compile_while_statement(statement as WhileStatement)

            case "StaticPropertyDeclaration":
                return this.compile_static_property_declaration(statement as StaticPropertyDeclaration)

            case "NumericLiteral":
                return this.compile_numeric_literal(statement as NumericLiteral, is_main)
            case "Identifier":
                return this.compile_identifier(statement as Identifier, is_main, (options ?? {}).add_suffix ?? true, (options ?? {}).block_root ?? false)
            case "StringLiteral":
                return this.compile_string_literal(statement as StringLiteral, is_main)
            case "ArrayLiteral":
                return this.compile_array_literal(statement as ArrayLiteral, is_main)
            case "ObjectLiteral":
                return this.compile_object_literal(statement as ObjectLiteral, is_main)
            case "FunctionLiteral":
                return this.compile_function_literal(statement as FunctionLiteral, is_main, (options ?? {}).is_constructor ?? false)
            case "ClassLiteral":
                return this.compile_class_literal(statement as ClassLiteral, is_main)

            case "BinaryExpression":
                return this.compile_binary_expression(statement as BinaryExpression, is_main)
            case "ComparisonExpression":
                return this.compile_comparison_expression(statement as ComparisonExpression, is_main)
            case "AssignmentExpression":
                return this.compile_assignment_expression(statement as AssignmentExpression, is_main, true)
            case "LogicalExpression":
                return this.compile_logical_expression(statement as LogicalExpression, is_main)
            case "LogicalNotExpression":
                return this.compile_logical_not_expression(statement as LogicalNotExpression, is_main)
            case "BitwiseExpression":
                return this.compile_bitwise_expression(statement as BitwiseExpression, is_main)
            case "BitwiseNotExpression":
                return this.compile_bitwise_not_expression(statement as BitwiseNotExpression, is_main)
            case "MemberCallExpression":
                return this.compile_member_call_expression(statement as MemberCallExpression, is_main)
            case "FunctionCallExpression":
                return this.compile_function_call_expression(statement as FunctionCallExpression, is_main)

            case "CommaExpression":
                return this.compile_comma_expression(statement as CommaExpression, is_main)

            case "NewExpression":
                return this.compile_new_expression(statement as NewExpression, is_main)

            case "ConditionalExpression":
                return this.compile_conditional_expression(statement as ConditionalExpression, is_main)

            case "InstanceOfExpression":
                return this.compile_instance_of_expression(statement as InstanceOfExpression, is_main)
            case "TypeOfExpression":
                return this.compile_type_of_expression(statement as TypeOfExpression, is_main)

            case "AwaitExpression":
                return this.compile_await_expression(statement as AwaitExpression, is_main)

            default:
                throw new HydroScriptInternalError(`Statement kind ${statement.kind} is not yet implemented in compiler`)
        }

    }

    private compile_block(statement: Block, is_main: boolean): string {
        let result: string = ""
        for (let i = 0; i <= statement.body.length - 1; i++) {
            const current = statement.body[i]
            result += this.compile_statement(current, true, { block_root: true })
        }
        return `{${result}}${is_main ? ";" : ""}`
    }

    private compile_class_block(statement: ClassBlock): string {
        const { constructor, definitions, initializers, statics } = statement

        const static_statements: string[] = []
        for (const stmt of statics) static_statements.push(this.compile_static_property_declaration(stmt))
        const definition_statements: string[] = []
        for (const stmt of definitions) {
            if (stmt.left.kind != "Identifier") throw new HydroScriptCompileError("Left side of method/property definition is not Identifier")
            const compiled = stmt.right.kind == "FunctionLiteral" ?
                this.compile_function_literal(stmt.right as FunctionLiteral, true, false, this.compile_identifier(stmt.left as Identifier, false, false)) :
                this.compile_assignment_expression(stmt, true, false, false, false)
            definition_statements.push(compiled)
        }
        const constructor_string: string = constructor ? this.compile_function_literal(constructor, true, true) : ""
        const initializer_expressions: string[] = []
        for (const init of initializers) initializer_expressions.push(this.compile_identifier(init, true, false))

        return `{${static_statements.join("")}${initializer_expressions.join("")}${constructor_string}${definition_statements.join("")}}`
    }

    private compile_import_statement(statement: ImportStatement): string {
        this.imports.push([statement.target, statement.path])
        return ""
    }

    private compile_return_statement(statement: ReturnStatement, global_scope: boolean): string {
        if (global_scope) return this.export = statement.value, ""
        return `return ${this.compile_statement(statement.value, true)}`
    }

    private compile_throw_statement(statement: ThrowStatement): string {
        return `throw ${this.compile_statement(statement.value, true)}`
    }

    private compile_if_statement(statement: IfStatement): string {
        const condition = this.compile_statement(statement.condition, false)
        const body = this.compile_block(statement.body, false)
        const else_body = statement.else ? this.compile_block(statement.else, true) : ""
        return `if (${condition}) ${body}${statement.else ? ` else ${else_body}` : ""}`
    }

    private compile_while_statement(statement: WhileStatement): string {
        const condition = this.compile_statement(statement.condition, false)
        const body = this.compile_block(statement.body, true)
        return `while (${condition}) ${body}`
    }

    private compile_static_property_declaration(statement: StaticPropertyDeclaration): string {
        return `static ${this.compile_assignment_expression(statement.expression, true, false, false)}`
    }

    private compile_numeric_literal(expression: NumericLiteral, is_main: boolean): string {
        return `${expression.value}${is_main ? ";" : ""}`
    }

    private compile_identifier(expression: Identifier, is_main: boolean, suffix: boolean = true, block_root: boolean = false): string {
        const defaults = {
            object: "Expression",
            kind: "Identifier",
            symbol: "false"
        } as Identifier
        const force_init_var_option = (get_item(this.options.value, "force_init_var") ?? defaults) as Identifier
        if (force_init_var_option.kind != "Identifier" || (force_init_var_option.symbol != "true" && force_init_var_option.symbol != "false")) throw new HydroScriptCompileError("\"force_init_var\" option is not a valid boolean")
        const force_init_var = force_init_var_option.symbol == "true"
        
        if (block_root && force_init_var) this.variables.push(add_suffix(expression.symbol))
        return `${suffix ? add_suffix(expression.symbol) : expression.symbol}${is_main ? ";" : ""}`
    }

    private compile_string_literal(expression: StringLiteral, is_main: boolean): string {
        return `${format_string_literal(expression)}${is_main ? ";" : ""}`
    }

    private compile_array_literal(expression: ArrayLiteral, is_main: boolean): string {
        if (expression.value.length == 0) return `[]${is_main ? ";" : ""}`
        return `[ ${expression.value.map(v => this.compile_statement(v, false)).join(", ")} ]${is_main ? ";" : ""}`
    }

    private compile_object_literal(expression: ObjectLiteral, is_main: boolean): string {
        const dict = list_to_dict_string(expression.value, t => this.compile_statement(t, false))
        return `${dict}${is_main ? ";" : ""}`
    }

    private compile_function_literal(expression: FunctionLiteral, is_main: boolean, is_constructor: boolean, method_name?: string): string {
        const defaults = {
            object: "Expression",
            kind: "NumericLiteral",
            value: "0"
        } as NumericLiteral
        const force_function_option = (get_item(this.options.value, "force_function") ?? defaults) as NumericLiteral
        if (force_function_option.kind != "NumericLiteral" || !((parseFloat(force_function_option.value) >= 0 && parseFloat(force_function_option.value) <= 2) && parseFloat(force_function_option.value) == parseInt(force_function_option.value))) throw new HydroScriptCompileError("\"force_function\" option is not a valid numeric literal")
        
        const force_function = parseInt(force_function_option.value)

        const { body, parameters } = expression
        const asynchronous = expression.async
        
        const params: string[] = []
        for (let i = 0; i <= parameters.length - 1; i++) params.push(this.compile_identifier(parameters[i], false))

        if (method_name && body.body.length == 1 && body.body[0].object == "Expression") body.body[0] = {
            object: "Statement",
            kind: "ReturnStatement",
            value: body.body[0]
        } as ReturnStatement
        const block_string = this.compile_block(body, false)
        const block = (force_function != 1 && body.body.length == 1 && body.body[0].object == "Expression") ?
            block_string.substring(1, block_string.length - 2) :
            block_string

        if (is_constructor) return `constructor(${params.join(", ")}) ${block_string}${is_main ? ";" : ""}`
        if (method_name) return `${method_name}(${params.join(", ")}) ${block_string}${is_main ? ";" : ""}`
        if (force_function == 1 || !(body.body.length == 1 && body.body[0].object == "Expression")) return `(${asynchronous ? "async " : ""}function (${params.join(", ")}) ${block})${is_main ? ";" : ""}`
        else return `(${asynchronous ? "async " : ""}(${params.join(", ")}) => ${block})${is_main ? ";" : ""}`
    }

    private compile_class_literal(expression: ClassLiteral, is_main: boolean): string {
        return `(class${expression.extends ? ` extends ${this.compile_statement(expression.extends, false)}` : ""} ${this.compile_class_block(expression.definition)})${is_main ? ";" : ""}`
    }

    private compile_binary_expression(expression: BinaryExpression, is_main: boolean): string {
        return `(${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)})${is_main ? ";" : ""}`
    }
    
    private compile_comparison_expression(expression: ComparisonExpression, is_main: boolean): string {
        return `(${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)})${is_main ? ";" : ""}`
    }

    private compile_assignment_expression(expression: AssignmentExpression, is_main: boolean, init_var: boolean = true, brackets: boolean = true, add_suffix: boolean = true): string {
        if (expression.left.kind != "Identifier"
        && expression.left.kind != "MemberCallExpression") throw new HydroScriptCompileError(`Left side of AssignmentExpression: ${format_parsing_error([ "StringLiteral", "MemberCallExpression" ], expression.left.kind)}`)
        if (init_var && expression.left.kind == "Identifier") this.variables.push(this.compile_identifier(expression.left as Identifier, false, add_suffix))
        const final = `${this.compile_statement(expression.left, false, { add_suffix })} ${expression.operator} ${this.compile_statement(expression.right, false, { add_suffix })}`
        if (brackets) return `(${final})${is_main ? ";" : ""}`
        return `${final}${is_main ? ";" : ""}`
    }

    private compile_logical_expression(expression: LogicalExpression, is_main: boolean): string {
        return `(${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)})${is_main ? ";" : ""}`
    }

    private compile_logical_not_expression(expression: LogicalNotExpression, is_main: boolean): string {
        return `(!${this.compile_statement(expression.target, false)})${is_main ? ";" : ""}`
    }

    private compile_bitwise_expression(expression: BitwiseExpression, is_main: boolean): string {
        return `(${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)})${is_main ? ";" : ""}`
    }

    private compile_bitwise_not_expression(expression: BitwiseNotExpression, is_main: boolean): string {
        return `(~${this.compile_statement(expression.target, false)})${is_main ? ";" : ""}`
    }

    private compile_member_call_expression(expression: MemberCallExpression, is_main: boolean): string {
        const list: string[] = []
        for (let i = 0; i <= expression.chain.length - 1; i++) list.push(this.compile_statement(expression.chain[i], false))
        return `${this.compile_statement(expression.target, false)}[${list.join("][")}]${is_main ? ";" : ""}`
    }

    private compile_function_call_expression(expression: FunctionCallExpression, is_main: boolean, parenthesis: boolean = true): string {
        const callee = this.compile_statement(expression.callee, false)
        const comma = this.compile_comma_expression(expression.arguments, false)
        return `${parenthesis ? "(" : ""}${callee}${comma}${parenthesis ? ")" : ""}${is_main ? ";" : ""}`
    }

    private compile_comma_expression(expression: CommaExpression, is_main: boolean): string {
        let args: string[] = []
        for (let i = 0; i <= expression.expressions.length - 1; i++) {
            args.push(this.compile_statement(expression.expressions[i] as Expression, false, { block_root: true }))
        }
        return `(${args.join(",")})${is_main ? ";" : ""}`
    }

    private compile_new_expression(expression: NewExpression, is_main: boolean): string {
        return `(new ${this.compile_function_call_expression(expression.target, false, false)})${is_main ? ";" : ""}`
    }

    private compile_conditional_expression(expression: ConditionalExpression, is_main: boolean): string {
        const condition = this.compile_statement(expression.condition, false)
        const body = this.compile_statement(expression.body, false)
        const else_body = this.compile_statement(expression.else, false)
        return `(${condition} ? ${body} : ${else_body})${is_main ? ";" : ""}`
    }

    private compile_instance_of_expression(expression: InstanceOfExpression, is_main: boolean): string {
        return `(${this.compile_statement(expression.target, false)} instanceof ${this.compile_statement(expression.class, false)})${is_main ? ";" : ""}`
    }

    private compile_type_of_expression(expression: TypeOfExpression, is_main: boolean): string {
        return `(typeof ${this.compile_statement(expression.target, false)})${is_main ? ";" : ""}`
    }

    private compile_await_expression(expression: AwaitExpression, is_main: boolean): string {
        return `(await ${this.compile_statement(expression.target, false)})${is_main ? ";" : ""}`
    }
}