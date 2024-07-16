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
import LoopStatement from "../ast/loop_statement"
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
import VoidExpression from "../ast/void_expression"
import ShortIfStatement from "../ast/short_if_statement"
import RegularExpression from "../ast/regular_expression"
import TryStatement from "../ast/try_statement"
import InExpression from "../ast/in_expression"
import ToExpression from "../ast/to_expression"
import OfExpression from "../ast/of_expression"
import ContinueStatement from "../ast/continue_statement"
import BreakStatement from "../ast/break_statement"
import LocalAssignmentExpression from "../ast/local_assignment_expression"
import DeclarationStatement from "../ast/declaration_statement"
import Getter from "../ast/getter"
import Setter from "../ast/setter"
import UnaryExpression from "../ast/unary_expression"

import WhileLoop from "../ast/loops/while"
import ForLoop from "../ast/loops/for"
import ForInLoop from "../ast/loops/for_in"
import ForOfLoop from "../ast/loops/for_of"

import Component from "./component"

import format_string_literal from "../utils/format_string_literal"
import list_to_dict_string from "../utils/list_to_dict_string"
import { add_suffix } from "../utils/is_reserved"
import get_item from "../utils/get_item"

import { HydroScriptInternalError, HydroScriptCompileError, format_parsing_error } from "../error"

import libraries from "../libs"

export default class JavaScriptCompiler {
    private imports: [Identifier, StringLiteral][]
    private export: Expression | null = null
    private variables: string[] = []

    private states = {
        libs: {
            __to: false
        }
    }

    private options: ObjectLiteral

    public compile(program: Program): string {

        this.imports = []
        this.export = null
        this.variables = []
        
        this.options = program.options

        let result: string = ""
        for (let i = 0; i <= program.body.length - 1; i++) {
            const statement = program.body[i]
            const stmt = this.compile_statement(statement, true, { block_root: true, global_scope: true })
            if (stmt.data.declaration) this.variables.push(stmt.data.declaration)
            result += stmt.raw
        }

        let libs: string = ""
        if (this.states.libs.__to) libs += libraries.__to + "\n"

        let variables = ""

        if (this.variables.length != 0) variables = `var ${[...new Set(this.variables)].join(", ")};\n`
        let imports = ""
        for (const importing of this.imports) {
            imports += `import ${importing[0].symbol} from ${format_string_literal(importing[1])};\n`
        }

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
            imports,
            libs,
            variables,
            result,
            this.export ? `export default ${this.compile_statement(this.export, true, { block_root: true })}` : ""
        ].join("")

    }

    private compile_statement(statement: Statement, is_main: boolean, options?: Record<string, any>): Component {

        switch (statement.kind) {
            case "Program":
                throw new HydroScriptInternalError("Program node is not allowed in compile_statement method")
            case "Block":
                return this.compile_block(statement as Block, is_main)
            case "ClassBlock":
                return this.compile_class_block(statement as ClassBlock)

            case "ImportStatement":
                return this.compile_import_statement(statement as ImportStatement)

            case "DeclarationStatement":
                return this.compile_declaration_statement(statement as DeclarationStatement)
            case "LocalAssignmentExpression":
                return this.compile_local_assignment_expression(statement as LocalAssignmentExpression, is_main)

            case "ContinueStatement":
                return this.compile_continue_statement(statement as ContinueStatement)
            case "BreakStatement":
                return this.compile_break_statement(statement as BreakStatement)
            case "ReturnStatement":
                return this.compile_return_statement(statement as ReturnStatement, (options ?? {}).global_scope ?? false)

            case "ThrowStatement":
                return this.compile_throw_statement(statement as ThrowStatement)

            case "IfStatement":
                return this.compile_if_statement(statement as IfStatement)
            case "ShortIfStatement":
                return this.compile_short_if_statement(statement as ShortIfStatement)
            case "LoopStatement":
                return this.compile_loop_statement(statement as LoopStatement)
            case "TryStatement":
                return this.compile_try_statement(statement as TryStatement)

            case "StaticPropertyDeclaration":
                return this.compile_static_property_declaration(statement as StaticPropertyDeclaration)
            case "Getter":
                return this.compile_getter(statement as Getter)
            case "Setter":
                return this.compile_setter(statement as Setter)

            case "NumericLiteral":
                return this.compile_numeric_literal(statement as NumericLiteral, is_main)
            case "Identifier":
                return this.compile_identifier(statement as Identifier, is_main, (options ?? {}).add_suffix ?? true, (options ?? {}).block_root ?? false)
            case "StringLiteral":
                return this.compile_string_literal(statement as StringLiteral, is_main)
            case "RegularExpression":
                return this.compile_regular_expression(statement as RegularExpression, is_main)
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
            case "UnaryExpression":
                return this.compile_unary_expression(statement as UnaryExpression, is_main)
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
            case "InExpression":
                return this.compile_in_expression(statement as InExpression, is_main)
            case "OfExpression":
                throw new HydroScriptCompileError("Statement kind OfExpression is not allowed outside of LoopStatement")
            case "ToExpression":
                return this.compile_to_expression(statement as ToExpression, is_main)
            case "MemberCallExpression":
                return this.compile_member_call_expression(statement as MemberCallExpression, is_main)
            case "FunctionCallExpression":
                return this.compile_function_call_expression(statement as FunctionCallExpression, is_main)

            case "CommaExpression":
                return this.compile_comma_expression(statement as CommaExpression, is_main)

            case "NewExpression":
                return this.compile_new_expression(statement as NewExpression, is_main)

            case "VoidExpression":
                return this.compile_void_expression(statement as VoidExpression, is_main)

            case "ConditionalExpression":
                return this.compile_conditional_expression(statement as ConditionalExpression, is_main)

            case "InstanceOfExpression":
                return this.compile_instance_of_expression(statement as InstanceOfExpression, is_main)
            case "TypeOfExpression":
                return this.compile_type_of_expression(statement as TypeOfExpression, is_main)

            case "AwaitExpression":
                return this.compile_await_expression(statement as AwaitExpression, is_main)

            default:
                throw new HydroScriptInternalError(`Statement kind ${statement.kind} is not yet implemented in the JavaScript compiler`)
        }

    }

    private compile_block(statement: Block, is_main: boolean): Component {
        let result: string = ""
        const locals: string[] = []
        for (let i = 0; i <= statement.body.length - 1; i++) {
            const current = statement.body[i]
            const stmt = this.compile_statement(current, true, { block_root: true })
            if (stmt.data.declaration) locals.push(stmt.data.declaration)
            result += stmt
        }
        return new Component(`{\n${locals.length > 0 ? `var ${[...new Set(locals)].join(", ")};\n` : ""}${result}}${is_main ? ";\n" : ""}`)
    }

    private compile_class_block(statement: ClassBlock): Component {
        const { constructor, definitions, initializers, statics, getters, setters } = statement

        const static_statements: string[] = []
        for (const stmt of statics) static_statements.push(this.compile_static_property_declaration(stmt).raw)
        const definition_statements: string[] = []
        for (const stmt of definitions) {
            if (stmt.left.kind != "Identifier") throw new HydroScriptCompileError("Left side of method/property definition is not Identifier")
            const compiled = stmt.right.kind == "FunctionLiteral" ?
                this.compile_function_literal(stmt.right as FunctionLiteral, true, false, this.compile_identifier(stmt.left as Identifier, false, false).raw) :
                this.compile_assignment_expression(stmt, true, false, false, false)
            definition_statements.push(compiled.raw)
        }
        const constructor_string: string = constructor ? this.compile_function_literal(constructor, true, true).raw : ""
        const initializer_expressions: string[] = []
        for (const init of initializers) initializer_expressions.push(this.compile_identifier(init, true, false).raw)
        const getter_statements: string[] = []
        for (const gtr of getters) getter_statements.push(this.compile_getter(gtr).raw)
        const setter_statements: string[] = []
        for (const str of setters) setter_statements.push(this.compile_setter(str).raw)

        return new Component(`{\n${static_statements.join("")}${initializer_expressions.join("")}${constructor_string}${definition_statements.join("")}${getter_statements.join("")}${setter_statements.join("")}}`)
    }

    private compile_import_statement(statement: ImportStatement): Component {
        this.imports.push([statement.target, statement.path])
        return new Component()
    }

    private compile_declaration_statement(statement: DeclarationStatement): Component {
        const str = `var ${this.compile_identifier(statement.target, false)} = ${this.compile_statement(statement.value, true)}`
        return new Component(str)
    }

    private compile_local_assignment_expression(expression: LocalAssignmentExpression, is_main: boolean): Component {
        return new Component(this.compile_assignment_expression(expression.assignment, is_main, false, true, true).raw, expression.assignment.left.kind == "Identifier" ? {
            declaration: this.compile_identifier(expression.assignment.left as Identifier, false, true)
        } : {})
    }

    private compile_continue_statement(statement: ContinueStatement): Component {
        return new Component("continue;\n")
    }

    private compile_break_statement(statement: BreakStatement): Component {
        return new Component("break;\n")
    }

    private compile_return_statement(statement: ReturnStatement, global_scope: boolean): Component {
        if (global_scope) {
            if (this.export) throw new HydroScriptCompileError("Found multiple export statements")
            this.export = statement.value
            return new Component()
        }
        return new Component(`return ${this.compile_statement(statement.value, true)}`)
    }

    private compile_throw_statement(statement: ThrowStatement): Component {
        return new Component(`throw ${this.compile_statement(statement.value, true)}`)
    }

    private compile_if_statement(statement: IfStatement): Component {
        const condition = this.compile_statement(statement.condition, false).raw
        const body = this.compile_block(statement.body, false).raw
        const else_body = statement.else ? this.compile_block(statement.else, true).raw : ""
        return new Component(`if ${condition.startsWith("(") ? condition : `(${condition})`} ${body}${statement.else ? ` else ${else_body}` : ""}`)
    }

    private compile_short_if_statement(statement: ShortIfStatement): Component {
        const stmt = this.compile_statement(statement.statement, true).raw
        const condition = this.compile_statement(statement.condition, false).raw
        let else_body: string = ""
        if (statement.else) else_body = ` else ${this.compile_statement(statement.else, true).raw}`
        return new Component(`if ${condition.startsWith("(") ? condition : `(${condition})`} ${stmt}${else_body}`)
    }

    private compile_loop_statement(statement: LoopStatement): Component {

        switch (statement.loop.type) {
            case "While": {
                const condition = this.compile_statement((statement.loop as WhileLoop).condition, false).raw
                const body = this.compile_block((statement.loop as WhileLoop).body, true).raw
                return new Component(`while ${condition.startsWith("(") ? condition : `(${condition})`} ${body}`)
            }

            case "For": {
                const initialize = this.compile_statement((statement.loop as ForLoop).initialize, false).raw
                const condition = this.compile_statement((statement.loop as ForLoop).condition, false).raw
                const afterthought = this.compile_statement((statement.loop as ForLoop).afterthought, false).raw
                const body = this.compile_block((statement.loop as ForLoop).body, true).raw
                return new Component(`for (\n${initialize};\n${condition};\n${afterthought}\n) ${body}`)
            }

            case "ForIn": {
                const in_expr = this.compile_in_expression((statement.loop as ForInLoop).in, false, true).raw
                const body = this.compile_block((statement.loop as ForInLoop).body, true).raw
                return new Component(`for ${in_expr} ${body}`)
            }

            case "ForOf": {
                const of_expr = this.compile_of_expression((statement.loop as ForOfLoop).of, false, true).raw
                const body = this.compile_block((statement.loop as ForOfLoop).body, false).raw
                return new Component(`for ${of_expr} ${body}`)
            }

            default:
                throw new HydroScriptInternalError("This loop type has not yet been implemented in the JavaScript compiler")
        }

    }

    private compile_try_statement(statement: TryStatement): Component {
        const try_body = `try ${this.compile_block(statement.try, false)}`
        let catch_body = ``
        let finally_body = ``
        if (statement.catch) catch_body = ` catch (${this.compile_identifier(statement.catch.identifier, false)}) ${this.compile_block(statement.catch.body, false)}`
        if (statement.finally) finally_body = ` finally ${this.compile_block(statement.finally, false)}`
        return new Component(`${try_body}${catch_body}${finally_body};\n`)
    }

    private compile_static_property_declaration(statement: StaticPropertyDeclaration): Component {
        if (statement.expression.kind == "AssignmentExpression") return new Component(`static ${this.compile_assignment_expression(statement.expression, true, false, false, false)}`)
        else return new Component(`static ${this.compile_statement(statement.expression, true)}`)
    }

    private compile_getter(statement: Getter): Component {
        const block = statement.body.body.length == 1 && statement.body.body[0].object == "Expression" ?
            `{\nreturn ${this.compile_statement(statement.body.body[0], true)}}` :
            this.compile_block(statement.body, false)
        return new Component(`get ${this.compile_identifier(statement.name, false, false)}() ${block};\n`)
    }

    private compile_setter(statement: Setter): Component {
        const id = this.compile_identifier(statement.name, false, false)
        const param = this.compile_identifier(statement.parameter, false, true)
        const block = statement.body.body.length == 1 && statement.body.body[0].object == "Expression" ?
            `{\nreturn ${this.compile_statement(statement.body.body[0], true)}}` :
            this.compile_block(statement.body, false)
        return new Component(`set ${id}(${param}) ${block};\n`)
    }

    private compile_numeric_literal(expression: NumericLiteral, is_main: boolean): Component {
        return new Component(`${expression.value}${is_main ? ";\n" : ""}`)
    }

    private compile_identifier(expression: Identifier, is_main: boolean, suffix: boolean = true, block_root: boolean = false): Component {
        const defaults = {
            object: "Expression",
            kind: "Identifier",
            symbol: "false"
        } as Identifier
        const force_init_var_option = (get_item(this.options.value, "force_init_var") ?? defaults) as Identifier
        if (force_init_var_option.kind != "Identifier" || (force_init_var_option.symbol != "true" && force_init_var_option.symbol != "false")) throw new HydroScriptCompileError("\"force_init_var\" option is not a valid boolean")
        const force_init_var = force_init_var_option.symbol == "true"
        
        if (block_root && force_init_var) this.variables.push(add_suffix(expression.symbol))
        return new Component(`${suffix ? add_suffix(expression.symbol) : expression.symbol}${is_main ? ";\n" : ""}`)
    }

    private compile_string_literal(expression: StringLiteral, is_main: boolean): Component {
        return new Component(`${format_string_literal(expression)}${is_main ? ";\n" : ""}`)
    }

    private compile_regular_expression(expression: RegularExpression, is_main: boolean): Component {
        return new Component(`${expression.value}${is_main ? ";\n" : ""}`)
    }

    private compile_array_literal(expression: ArrayLiteral, is_main: boolean): Component {
        if (expression.value.length == 0) return new Component(`[]${is_main ? ";\n" : ""}`)
        return new Component(`[ ${expression.value.map(v => this.compile_statement(v, false)).join(", ")} ]${is_main ? ";\n" : ""}`)
    }

    private compile_object_literal(expression: ObjectLiteral, is_main: boolean): Component {
        const dict = list_to_dict_string(expression.value, t => this.compile_statement(t, false))
        return new Component(`${dict}${is_main ? ";\n" : ""}`)
    }

    private compile_function_literal(expression: FunctionLiteral, is_main: boolean, is_constructor: boolean, method_name?: string): Component {
        const { body, parameters } = expression
        const asynchronous = expression.async
        
        const params: string[] = []
        for (let i = 0; i <= parameters.length - 1; i++) params.push(this.compile_identifier(parameters[i], false).raw)

        if (method_name && body.body.length == 1 && body.body[0].object == "Expression") body.body[0] = {
            object: "Statement",
            kind: "ReturnStatement",
            value: body.body[0]
        } as ReturnStatement
        const block_string = this.compile_block(body, false).raw
        const block = body.body[0] && body.body[0].object == "Expression" && body.body.length == 1 ?
            this.compile_statement(body.body[0], false) :
            block_string

        if (is_constructor) return new Component(`constructor(${params.join(", ")}) ${block_string}${is_main ? ";\n" : ""}`)
        if (method_name) return new Component(`${method_name}(${params.join(", ")}) ${block_string}${is_main ? ";\n" : ""}`)
        else return new Component(`${!is_main ? "(" : ""}${asynchronous ? "async " : ""}(${params.join(", ")}) => ${block}${!is_main ? ")" : ""}${is_main ? ";\n" : ""}`)
    }

    private compile_class_literal(expression: ClassLiteral, is_main: boolean): Component {
        const str = `class${expression.extends ? ` extends ${this.compile_statement(expression.extends, false)}` : ""} ${this.compile_class_block(expression.definition)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_binary_expression(expression: BinaryExpression, is_main: boolean): Component {
        const str = `${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_unary_expression(expression: UnaryExpression, is_main: boolean): Component {
        const str = `${expression.sign}${this.compile_statement(expression.value, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }
    
    private compile_comparison_expression(expression: ComparisonExpression, is_main: boolean): Component {
        const str = `${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_assignment_expression(expression: AssignmentExpression, is_main: boolean, init_var: boolean = true, brackets: boolean = true, add_suffix: boolean = true): Component {
        if (expression.left.kind != "Identifier"
        && expression.left.kind != "MemberCallExpression") throw new HydroScriptCompileError(`Left side of AssignmentExpression: ${format_parsing_error([ "Identifier", "MemberCallExpression" ], expression.left.kind)}`)
        if (init_var && expression.left.kind == "Identifier") this.variables.push(this.compile_identifier(expression.left as Identifier, false, add_suffix).raw)
        const final = `${this.compile_statement(expression.left, false, { add_suffix })} ${expression.operator} ${this.compile_statement(expression.right, false, { add_suffix })}`
        if (brackets && !is_main) return new Component(`(${final})${is_main ? ";\n" : ""}`)
        return new Component(`${final}${is_main ? ";\n" : ""}`)
    }

    private compile_logical_expression(expression: LogicalExpression, is_main: boolean): Component {
        const str = `${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_logical_not_expression(expression: LogicalNotExpression, is_main: boolean): Component {
        const str = `!${this.compile_statement(expression.target, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_bitwise_expression(expression: BitwiseExpression, is_main: boolean): Component {
        const str = `${this.compile_statement(expression.left, false)} ${expression.operator} ${this.compile_statement(expression.right, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_bitwise_not_expression(expression: BitwiseNotExpression, is_main: boolean): Component {
        const str = `~${this.compile_statement(expression.target, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_in_expression(expression: InExpression, is_main: boolean, in_for: boolean = false): Component {
        const str = `${in_for ? "var " : ""}${this.compile_statement(expression.left, false)} in ${this.compile_statement(expression.right, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_of_expression(expression: OfExpression, is_main: boolean, in_for: boolean = false): Component {
        const str = `${in_for ? "var " : ""}${this.compile_statement(expression.left, false)} of ${this.compile_statement(expression.right, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_to_expression(expression: ToExpression, is_main: boolean): Component {
        this.states.libs.__to = true
        const start = this.compile_statement(expression.start, false).raw
        const end = this.compile_statement(expression.end, false).raw
        const inc = this.compile_statement(expression.increment, false).raw
        return new Component(`__to(${start}, ${end}, ${inc})${is_main ? ";\n" : ""}`)
    }

    private compile_member_call_expression(expression: MemberCallExpression, is_main: boolean): Component {
        const list: string[] = []
        for (let i = 0; i <= expression.chain.length - 1; i++) list.push(this.compile_statement(expression.chain[i], false).raw)
        return new Component(`${this.compile_statement(expression.target, false)}[${list.join("][")}]${is_main ? ";\n" : ""}`)
    }

    private compile_function_call_expression(expression: FunctionCallExpression, is_main: boolean, parenthesis: boolean = true): Component {
        const callee = this.compile_statement(expression.callee, false)
        const comma = this.compile_comma_expression(expression.arguments, false)
        return new Component(`${parenthesis && !is_main ? "(" : ""}${callee}${comma}${parenthesis && !is_main ? ")" : ""}${is_main ? ";\n" : ""}`)
    }

    private compile_comma_expression(expression: CommaExpression, is_main: boolean): Component {
        let args: string[] = []
        for (let i = 0; i <= expression.expressions.length - 1; i++) {
            args.push(this.compile_statement(expression.expressions[i] as Expression, false, { block_root: true }).raw)
        }
        const str = `(${args.join(", ")})`
        return new Component(is_main ? `${str};\n` : str)
    }

    private compile_new_expression(expression: NewExpression, is_main: boolean): Component {
        const str = `new ${this.compile_function_call_expression(expression.target, false, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_void_expression(expression: VoidExpression, is_main: boolean): Component {
        const str = `void ${this.compile_statement(expression.value, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_conditional_expression(expression: ConditionalExpression, is_main: boolean): Component {
        const condition = this.compile_statement(expression.condition, false)
        const body = this.compile_statement(expression.body, false)
        const else_body = this.compile_statement(expression.else, false)
        const str = `${condition} ? ${body} : ${else_body}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_instance_of_expression(expression: InstanceOfExpression, is_main: boolean): Component {
        const str = `${this.compile_statement(expression.target, false)} instanceof ${this.compile_statement(expression.class, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_type_of_expression(expression: TypeOfExpression, is_main: boolean): Component {
        const str = `typeof ${this.compile_statement(expression.target, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }

    private compile_await_expression(expression: AwaitExpression, is_main: boolean): Component {
        const str = `await ${this.compile_statement(expression.target, false)}`
        return new Component(is_main ? `${str};\n` : `(${str})`)
    }
}