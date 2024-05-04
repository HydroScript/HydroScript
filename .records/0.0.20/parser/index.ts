import Program from "../ast/program"
import Expression from "../ast/expression"
import Identifier from "../ast/identifier"
import NumericLiteral from "../ast/numeric_literal"
import BinaryExpression from "../ast/binary_expression"
import ComparativeExpression from "../ast/comparison_expression"
import AssignmentExpression from "../ast/assignment_expression"
import LogicalExpression from "../ast/logical_expression"
import BitwiseExpression from "../ast/bitwise_expression"
import LogicalNotExpression from "../ast/logical_not_expression"
import AwaitExpression from "../ast/await_expression"
import BitwiseNotExpression from "../ast/bitwise_not_expression"
import InstanceOfExpression from "../ast/instance_of_expression"
import TypeOfExpression from "../ast/type_of_expression"
import FunctionCallExpression from "../ast/function_call_expression"
import MemberCallExpression from "../ast/member_call_expression"
import ObjectLiteral from "../ast/object_literal"
import StringLiteral from "../ast/string_literal"
import Statement from "../ast/statement"
import ClassLiteral from "../ast/class_literal"
import Block from "../ast/block"
import StaticPropertyDeclaration from "../ast/static_property_declaration"
import ClassBlock from "../ast/class_block"
import FunctionLiteral from "../ast/function_literal"
import ImportStatement from "../ast/import_statement"
import ConditionalExpression from "../ast/conditional_expression"
import IfStatement from "../ast/if_statement"
import WhileStatement from "../ast/while_statement"
import OptionsStatement from "../ast/options_statement"
import NewExpression from "../ast/new_expression"
import ReturnStatement from "../ast/return_statement"
import ThrowStatement from "../ast/throw_statement"
import ArrayLiteral from "../ast/array_literal"
import CommaExpression from "../ast/comma_expression"
import VoidExpression from "../ast/void_expression"
import ShortIfStatement from "../ast/short_if_statement"
import RegularExpression from "../ast/regular_expression"
import TryStatement from "../ast/try_statement"

import { TokenType } from "../lexer/token_type"
import { Token, token, tokenize } from "../lexer"
import { ProcessType } from "../process"

import remove_quotations from "../utils/remove_quotations"
import get_item from "../utils/get_item"
import throw_error from "../utils/throw"

import { HydroScriptInternalError, HydroScriptParsingError, HydroScriptSyntaxError, format_parsing_error } from "../error"

export default class Parser {
    private path: string
    private tokens: Token[] = []

    private is_end(): boolean {
        return this.tokens[0].type == TokenType.FileEnd
    }

    private at(): Token {
        return this.tokens[0] as Token
    }

    private next(amount?: number): Token {
        return this.tokens[amount ?? 1] as Token
    }

    private eat(): Token {
        return this.tokens.shift() as Token
    }

    private expect(type: TokenType): Token {
        const previous = this.eat()
        if (!previous || previous.type != type) throw_error(new HydroScriptSyntaxError(type, previous.type, this.path, previous.line, previous.column, ProcessType.Parse))
        return previous
    }

    private expect_multiple(...types: TokenType[]): Token {
        const previous = this.eat()
        if (!previous || !types.includes(previous.type)) throw_error(new HydroScriptSyntaxError(types, previous.type, this.path, previous.line, previous.column, ProcessType.Parse))
        return previous
    }

    constructor(path: string = "<unknown>") {
        this.path = path
    }

    public produce(code: string): Program {

        this.tokens = tokenize(code, this.path)
        
        const statements: Statement[] = []
        let options = {
            set: false,
            value: {
                object: "Expression",
                kind: "ObjectLiteral",
                value: []
            } as ObjectLiteral
        }

        while (!this.is_end()) {
            const statement = this.parse_statement({ is_root: true })
            
            if (statement.kind == "OptionsStatement") {
                if (options.set) throw new HydroScriptParsingError("Options are already set")
                options.set = true
                options.value = (statement as OptionsStatement).options
                continue
            }

            statements.push(statement)
        }

        return {
            object: "Program",
            kind: "Program",
            body: statements,
            options: options.value
        } as Program

    }

    // PRIMARY

    public parse_expression(): Expression {
        return this.parse_assignment_expression()
    }

    private parse_assignment_expression(): Expression {

        let left = this.parse_instance_of()

        while (this.at().type == TokenType.AssignmentOperator) {

            const operator = this.eat().value
            const right = this.parse_instance_of()
            left = {
                object: "Expression",
                kind: "AssignmentExpression",
                left,
                right,
                operator
            } as AssignmentExpression

        }

        return left

    }

    private parse_instance_of(): Expression {

        let left = this.parse_logical_expression()

        while (this.at().type == TokenType.InstanceOf) {

            const operator = this.eat().value
            const right = this.expect(TokenType.Identifier)
            left = {
                object: "Expression",
                kind: "InstanceOfExpression",
                target: left,
                class: {
                    object: "Expression",
                    kind: "Identifier",
                    symbol: right.value
                } as Identifier
            } as InstanceOfExpression

        }

        return left

    }

    private parse_logical_expression(): Expression {
        
        let left = this.parse_comparison_expression()

        while (this.at().type == TokenType.LogicalOperator) {

            const operator = this.eat().value
            const right = this.parse_comparison_expression()
            left = {
                object: "Expression",
                kind: "LogicalExpression",
                left,
                right,
                operator
            } as LogicalExpression

        }

        return left

    }

    private parse_comparison_expression(): Expression {

        let left = this.parse_bitwise_expression()

        while (this.at().type == TokenType.ComparisonOperator) {

            const operator = this.eat().value
            const right = this.parse_bitwise_expression()
            left = {
                object: "Expression",
                kind: "ComparisonExpression",
                left,
                right,
                operator
            } as ComparativeExpression

        }

        return left

    }

    private parse_bitwise_expression(): Expression {

        let left = this.parse_additive_expression()

        while (this.at().type == TokenType.BitwiseOperator) {

            const operator = this.eat().value
            const right = this.parse_additive_expression()
            left = {
                object: "Expression",
                kind: "BitwiseExpression",
                left,
                right,
                operator
            } as BitwiseExpression

        }

        return left

    }

    private parse_additive_expression(): Expression {

        let left = this.parse_multiplicative_expression()

        while (this.at().value == "+" || this.at().value == "-") {

            const operator = this.eat().value
            const right = this.parse_multiplicative_expression()
            left = {
                object: "Expression",
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression

        }

        return left

    }

    private parse_multiplicative_expression(): Expression {

        let left = this.parse_exponential_expression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {

            const operator = this.eat().value
            const right = this.parse_exponential_expression()
            left = {
                object: "Expression",
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression

        }

        return left

    }

    private parse_exponential_expression(): Expression {

        let left = this.parse_logical_not_expression()

        while (this.at().value == "**") {

            const operator = this.eat().value
            const right = this.parse_logical_not_expression()
            left = {
                object: "Expression",
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression

        }

        return left

    }

    private parse_logical_not_expression(): Expression {
        
        const operator = this.at().value

        if (operator != "!") return this.parse_bitwise_not_expression()

        this.eat()
        return {
            object: "Expression",
            kind: "LogicalNotExpression",
            target: this.parse_logical_not_expression()
        } as LogicalNotExpression

    }

    private parse_bitwise_not_expression(): Expression {
        
        const operator = this.at().value

        if (operator != "~") return this.parse_type_of_expression()

        this.eat()
        return {
            object: "Expression",
            kind: "BitwiseNotExpression",
            target: this.parse_logical_not_expression()
        } as BitwiseNotExpression

    }

    private parse_type_of_expression(): Expression {

        const operator = this.at().value

        if (operator != ";") return this.parse_primary_expression()

        this.eat()
        return {
            object: "Expression",
            kind: "TypeOfExpression",
            target: this.parse_logical_not_expression()
        } as TypeOfExpression

    }

    private parse_primary_expression(): Expression {

        const current_token = this.at()
        const token_type = current_token.type
        let expression = ((): Expression => {

            if (token_type == TokenType.Identifier || token_type == TokenType.Number) {

                switch (token_type) {
                    case TokenType.Identifier: {
                        const id = this.parse_identifier()
                        if (this.at().type == TokenType.ArithmeticAssignment) return this.parse_arithmetic_assignment(false, id)
                        return id
                    }
                    case TokenType.Number:
                        return this.parse_numeric_literal()
                }

            } else if (token_type == TokenType.RegularExpression) {

                return this.parse_regular_expression()

            } else if (token_type == TokenType.Function || token_type == TokenType.AsyncFunction) {

                return this.parse_function_literal()

            } else if (token_type == TokenType.Class) {

                return this.parse_class_literal()

            } else if (token_type == TokenType.New) {

                return this.parse_new_expression()

            } else if (token_type == TokenType.Void) {

                return this.parse_void_expression()

            } else if (token_type == TokenType.ArithmeticAssignment) {

                return this.parse_arithmetic_assignment(true)

            } else if (token_type == TokenType.OpenParenthesis) {

                const open = this.eat()
                const value = this.find_expression()
                const close = this.expect(TokenType.CloseParenthesis)
                return value as Expression

            } else if (token_type == TokenType.Await) {

                return this.parse_await_expression()

            } else if (token_type == TokenType.String) {

                return this.parse_string_literal()

            } else if (token_type == TokenType.OpenSquareBracket) {

                return this.parse_array_literal()

            } else if (token_type == TokenType.OpenCurlyBracket) {

                return this.parse_object_literal()
                
            }

            throw_error(new HydroScriptSyntaxError(null, token_type, this.path, current_token.line, current_token.column, ProcessType.Parse))

        })()

        while (expression.object == "Expression") {
            const next_token = this.at()
            if (next_token) {
                if (next_token.type == TokenType.OpenParenthesis) expression = this.parse_function_call_expression(expression as Expression)
                else if (next_token.type == TokenType.Dot || next_token.type == TokenType.OpenSquareBracket) {
                    expression = this.parse_member_call_expression(expression as Expression)
                    if (this.at().type == TokenType.ArithmeticAssignment) expression = this.parse_arithmetic_assignment(false, expression as MemberCallExpression)                        
                }
                else break
            }
            else break
        }

        return expression
    }

    private parse_arithmetic_assignment(pre: boolean, id?: Identifier | MemberCallExpression): Expression {

        const add = this.eat().value == "++"
        let tg = id
        if (pre) {
            const expr = this.parse_primary_expression()
            if (expr.kind != "Identifier" && expr.kind != "MemberCallExpression") throw new HydroScriptParsingError(format_parsing_error([
                "Identifier", "MemberCallExpression"
            ], expr.kind))
            tg = expr.kind == "Identifier" ? expr as Identifier : expr as MemberCallExpression
        }
        return {
            object: "Expression",
            kind: "CommaExpression",
            expressions: [
                {
                    object: "Expression",
                    kind: "AssignmentExpression",
                    left: tg,
                    right: {
                        object: "Expression",
                        kind: "NumericLiteral",
                        value: "1"
                    } as NumericLiteral,
                    operator: `${add ? "+" : "-"}=`
                } as AssignmentExpression,
                pre ? tg : {
                    object: "Expression",
                    kind: "BinaryExpression",
                    left: tg,
                    right: {
                        object: "Expression",
                        kind: "NumericLiteral",
                        value: "1"
                    } as NumericLiteral,
                    operator: !add ? "+" : "-"
                } as BinaryExpression
            ]
        } as CommaExpression

    }

    private parse_identifier(): Identifier {

        return {
            object: "Expression",
            kind: "Identifier",
            symbol: this.expect(TokenType.Identifier).value
        } as Identifier

    }

    private parse_numeric_literal(): NumericLiteral {

        return {
            object: "Expression",
            kind: "NumericLiteral",
            value: this.expect(TokenType.Number).value
        } as NumericLiteral

    }

    private parse_regular_expression(): RegularExpression {

        return {
            object: "Expression",
            kind: "RegularExpression",
            value: this.expect(TokenType.RegularExpression).value
        } as RegularExpression

    }

    private parse_await_expression(): Expression {

        const await_token = this.expect(TokenType.Await)
        const target = this.find_expression()
        return {
            object: "Expression",
            kind: "AwaitExpression",
            target
        } as AwaitExpression

    }

    private parse_string_literal(): Expression {

        const [ text, mark ] = remove_quotations(this.expect(TokenType.String).value)
        return {
            object: "Expression",
            kind: "StringLiteral",
            mark,
            value: text
        } as StringLiteral

    }

    private parse_new_expression(): Expression {

        const start = this.expect(TokenType.New)
        const target = this.parse_expression()
        if (target.kind != "FunctionCallExpression") throw new HydroScriptParsingError(format_parsing_error("FunctionCallExpression", target.kind))
        return {
            object: "Expression",
            kind: "NewExpression",
            target
        } as NewExpression
        
    }

    private parse_void_expression(): Expression {

        const start = this.expect(TokenType.Void)
        const value = this.find_expression()
        return {
            object: "Expression",
            kind: "VoidExpression",
            value
        } as VoidExpression

    }

    private parse_array_literal(): Expression {

        const open = this.expect(TokenType.OpenSquareBracket)
        const value: Expression[] = []
        while (this.at().type != TokenType.CloseSquareBracket) {
            value.push(this.find_expression())
        }
        this.expect(TokenType.CloseSquareBracket)
        return {
            object: "Expression",
            kind: "ArrayLiteral",
            value
        } as ArrayLiteral

    }

    private parse_object_literal(): Expression {

        const open = this.expect(TokenType.OpenCurlyBracket)
        const values: { key: string, value: Expression }[] = []
        while (true) {

            if (this.at().type == TokenType.CloseCurlyBracket) break
            let key: Token | string = this.expect_multiple(
                TokenType.String,
                TokenType.Identifier
            )
            key = (key.type == TokenType.String ? key : token(`"${key.value}"`, TokenType.String, key.line, key.column)).value
            if (get_item(values, key)) throw new HydroScriptParsingError("Dictionaries cannot have two keys with the same value")
            if (!this.next()) throw new HydroScriptParsingError("Cannot find value in ObjectLiteral declaration")
            const value = this.find_expression()
            values.push({
                key,
                value: value as Expression
            })

        }
        const close = this.expect(TokenType.CloseCurlyBracket)
        
        return {
            object: "Expression",
            kind: "ObjectLiteral",
            value: values
        } as ObjectLiteral

    }

    private parse_member_call_expression(expression: Expression): MemberCallExpression {
        
        const chain: Expression[] = []

        while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenSquareBracket) {
            const token_type = this.at().type
            if (token_type == TokenType.Dot) {

                this.eat()
                chain.push({
                    object: "Expression",
                    kind: "StringLiteral",
                    mark: "\"",
                    value: this.expect(TokenType.Identifier).value
                } as StringLiteral)

            } else if (token_type == TokenType.OpenSquareBracket) {

                this.eat()
                const expr = this.find_expression()
                chain.push(expr as Expression)
                this.expect(TokenType.CloseSquareBracket)

            } else throw new HydroScriptInternalError("Invalid token type presented")
        }

        return {
            object: "Expression",
            kind: "MemberCallExpression",
            target: expression,
            chain
        } as MemberCallExpression

    }

    private parse_function_call_expression(callee: Expression): Expression {

        return {
            object: "Expression",
            kind: "FunctionCallExpression",
            callee,
            arguments: this.parse_function_arguments()
        } as FunctionCallExpression

    }

    private parse_function_arguments(): Expression {

        let exprs: Expression[] = []
        const open = this.expect(TokenType.OpenParenthesis)
        if (this.at().type != TokenType.CloseParenthesis) exprs = this.parse_function_arguments_list()
        const close = this.expect(TokenType.CloseParenthesis)
        return {
            object: "Expression",
            kind: "CommaExpression",
            expressions: exprs
        } as CommaExpression

    }

    private parse_function_arguments_list(): Expression[] {

        const args = [ this.find_expression() ]
        while (!this.is_end() && this.at().type != TokenType.CloseParenthesis) args.push(this.find_expression())
        return args

    }

    private parse_comma_expression(expression?: Expression): Expression {

        if (!expression) this.expect(TokenType.OpenParenthesis)
        let exprs: Expression[] = []
        if (this.at().type != TokenType.CloseParenthesis) exprs = this.parse_comma_expression_list(expression)
        else throw new HydroScriptParsingError(format_parsing_error("Expression", TokenType.CloseParenthesis, this.at().line, this.at()))
        if (!expression) this.expect(TokenType.CloseParenthesis)
        return {
            object: "Expression",
            kind: "CommaExpression",
            expressions: exprs
        } as CommaExpression

    }

    private parse_comma_expression_list(expression?: Expression): Expression[] {

        const args = [ expression ? expression : this.find_expression() ]
        while (!this.is_end() && this.at().type == TokenType.Comma && this.eat()) {
            const expression = this.find_expression()
            if (expression.kind == "CommaExpression") args.push(...(expression as CommaExpression).expressions)
            else args.push(expression)
        }
        return args

    }

    // SECONDARY

    public find_expression(): Expression {
        const expr = this.parse_statement()
        if (expr.object != "Expression") throw new HydroScriptParsingError(format_parsing_error("Expression", "Statement"))
        return expr as Expression
    }

    public parse_statement(options: Record<string, any> = {}): Statement {
        
        let result = ((): Statement => {

            if (this.at().type == TokenType.Import) return this.parse_import_statement()
            if (this.at().type == TokenType.Return) return this.parse_return_statement()
            if (this.at().type == TokenType.Try) return this.parse_try_statement()
            if (this.at().type == TokenType.Throw) return this.parse_throw_statement()
            if (this.at().type == TokenType.Static) return this.parse_static_property_declaration(options.in_class ?? false)
            if (
                this.at().type == TokenType.Colon &&
                this.next().type == TokenType.Identifier &&
                this.next(2).type == TokenType.Colon
            ) return this.parse_environment_statement(options.is_root ?? false)

            const statement: Expression = this.parse_expression()
            let result: Statement = statement
            
            while (result.object == "Expression") {
                if (this.at().type == TokenType.QuestionMark) {
                    result = this.parse_if_statement(result as Expression)
                    continue
                } else if (this.at().type == TokenType.Unless) {
                    result = this.parse_if_statement({
                        object: "Expression",
                        kind: "LogicalNotExpression",
                        target: result
                    } as LogicalNotExpression)
                    continue
                } else if (this.at().type == TokenType.While) {
                    result = this.parse_while_statement(result as Expression)
                    break
                } else if (this.at().type == TokenType.Comma) {
                    result = this.parse_comma_expression(result as Expression)
                    continue
                }
                else break
            }

            return result

        })()

        while (true) {
            if (this.at().type == TokenType.ShortIfOperator || this.at().type == TokenType.ShortUnlessOperator) {
                result = this.parse_short_if_statement(result)
            } else break
        }

        return result

    }

    private parse_block(): Block {
        let has_brackets = true

        if (this.at().type != TokenType.OpenCurlyBracket) has_brackets = false
        else this.expect(TokenType.OpenCurlyBracket)

        const statements: Statement[] = []
        if (has_brackets) {
            while (true) {
                if (this.at().type == TokenType.CloseCurlyBracket) break
                statements.push(this.parse_statement())
            }
            const end = this.expect(TokenType.CloseCurlyBracket)
        } else statements.push(this.parse_statement())
        return {
            object: "Statement",
            kind: "Block",
            body: statements
        } as Block
    }

    private parse_class_block(): ClassBlock {
        const open = this.expect(TokenType.OpenCurlyBracket)

        const statics: StaticPropertyDeclaration[] = []
        const default_constructor = null
        let constructor: FunctionLiteral | null = default_constructor
        const initializers: Identifier[] = []
        const definitions: AssignmentExpression[] = []

        const statements: Statement[] = []
        while (true) {
            const current = this.at()
            if (current.object == "Token" && current.type == TokenType.CloseCurlyBracket) break
            const statement = this.parse_statement({ in_class: true })
            if (statement.object == "Statement" && statement.kind != "StaticPropertyDeclaration") throw new HydroScriptParsingError(format_parsing_error([ "Expression", "StaticPropertyDeclaration" ], statement.kind))
            statements.push(statement)
        }
        const end = this.expect(TokenType.CloseCurlyBracket)

        for (let i = 0; i <= statements.length - 1; i++) {
            const current = statements[i]
            if (current.kind == "StaticPropertyDeclaration") statics.push(current as StaticPropertyDeclaration)
            else if (current.kind == "AssignmentExpression") {
                if ((current as AssignmentExpression).operator != "=") throw new HydroScriptParsingError("Assignment operator in ClassLiteral definition is not =")
                definitions.push(current as AssignmentExpression)
            }
            else if (current.kind == "FunctionLiteral") {
                if (constructor != default_constructor) throw new HydroScriptParsingError("ClassLiteral definition cannot contain two or more constructors")
                if ((current as FunctionLiteral).async) throw new HydroScriptParsingError("Constructor cannot be asynchronous")
                constructor = current as FunctionLiteral
            }
            else if (current.kind == "Identifier") initializers.push(current as Identifier)
            else throw new HydroScriptParsingError(format_parsing_error([ "AssignmentExpression", "FunctionLiteral", "Identifier" ], current.kind))
        }

        return {
            object: "Statement",
            kind: "ClassBlock",
            statics,
            constructor,
            initializers,
            definitions
        } as ClassBlock
    }

    private parse_class_literal(): ClassLiteral {

        const start = this.expect(TokenType.Class)
        let extending: Expression | null = null
        if (this.at().type == TokenType.Colon) {
            this.eat()
            extending = this.find_expression()
        }
        const definition = this.parse_class_block()
        return {
            object: "Expression",
            kind: "ClassLiteral",
            extends: extending,
            definition
        } as ClassLiteral

    }

    private parse_import_statement(): ImportStatement {

        const start = this.expect(TokenType.Import)
        const target = this.parse_identifier()
        const path = this.parse_string_literal()
        return {
            object: "Statement",
            kind: "ImportStatement",
            target,
            path
        } as ImportStatement

    }

    private parse_return_statement(): ReturnStatement {

        const operator = this.expect(TokenType.Return)
        return {
            object: "Statement",
            kind: "ReturnStatement",
            value: this.find_expression()
        } as ReturnStatement

    }

    private parse_throw_statement(): ThrowStatement {

        const operator = this.expect(TokenType.Throw)
        return {
            object: "Statement",
            kind: "ThrowStatement",
            value: this.find_expression()
        } as ThrowStatement

    }

    private parse_static_property_declaration(in_class: boolean): StaticPropertyDeclaration {

        if (!in_class) throw new HydroScriptParsingError("Found StaticPropertyDeclaration outside of ClassBlock")
        const operator = this.expect(TokenType.Static)
        const expression = this.parse_expression()
        if (expression.kind != "AssignmentExpression") throw new HydroScriptParsingError(format_parsing_error("AssignmentExpression", expression.kind))
        return {
            object: "Statement",
            kind: "StaticPropertyDeclaration",
            expression
        } as StaticPropertyDeclaration

    }

    private parse_if_statement(expression: Expression): Statement {

        const mark = this.expect_multiple(TokenType.QuestionMark, TokenType.Unless)
        const body = this.parse_block()
        let else_body: Block | null = null

        const current = this.at()
        if (current && current.object == "Token" && current.type == TokenType.Colon) {
            const colon = this.expect(TokenType.Colon)
            else_body = this.parse_block()
        }

        if (
            else_body &&
            (body.body.length == 1 && body.body[0].object == "Expression") &&
            (else_body.body.length == 1 && else_body.body[0].object == "Expression")
        ) return {
            object: "Expression",
            kind: "ConditionalExpression",
            condition: expression,
            body: body.body[0],
            else: else_body.body[0]
        } as ConditionalExpression
        return {
            kind: "IfStatement",
            condition: expression,
            body,
            else: else_body
        } as IfStatement

    }

    private parse_while_statement(expression: Expression): WhileStatement {

        const mark = this.expect(TokenType.While)
        const body = this.parse_block()
        return {
            kind: "WhileStatement",
            condition: expression,
            body
        } as WhileStatement

    }

    private parse_try_statement(): TryStatement {

        const mark = this.expect(TokenType.Try)
        const try_block = this.parse_block()
        let catch_block: {
            identifier: Identifier,
            body: Block
        } = null
        let finally_block: Block = null
        if (this.at().type == TokenType.Catch) {
            this.expect(TokenType.Catch)
            catch_block = {
                identifier: this.parse_identifier(),
                body: this.parse_block()
            }
        }
        if (this.at().type == TokenType.Finally) {
            this.expect(TokenType.Finally)
            finally_block = this.parse_block()
        }

        if (!(catch_block || finally_block)) catch_block = {
            identifier: {
                object: "Expression",
                kind: "Identifier",
                symbol: "_"
            } as Identifier,
            body: {
                object: "Statement",
                kind: "Block",
                body: []
            } as Block
        }
        return {
            object: "Statement",
            kind: "TryStatement",
            try: try_block,
            catch: catch_block,
            finally: finally_block
        } as TryStatement

    }

    private parse_function_literal(): Expression {

        const sign = this.expect_multiple(TokenType.Function, TokenType.AsyncFunction)
        return {
            object: "Expression",
            kind: "FunctionLiteral",
            parameters: this.parse_function_parameters(),
            body: this.parse_block(),
            async: sign.value == ">>-"
        } as FunctionLiteral

    }

    private parse_function_parameters(): Identifier[] {

        let single_parameter = false
        let params: Identifier[] = []

        if (this.at().type == TokenType.OpenParenthesis) {

            this.expect(TokenType.OpenParenthesis)

            const current = this.at()
            if (current.type != TokenType.CloseParenthesis) params = this.parse_function_parameters_list()

            const close = this.expect(TokenType.CloseParenthesis)

        } else {
            params = [ this.parse_identifier() ]
            single_parameter = true
        }
        
        return params

    }

    private parse_function_parameters_list(): Identifier[] {

        const params = [ this.parse_identifier() ]

        const condition = (): boolean => {
            return Boolean(!this.is_end() && (this.at().type == TokenType.Comma) && this.eat())
        }
        while (condition()) params.push(this.parse_identifier())

        return params

    }

    private parse_short_if_statement(statement: Statement): ShortIfStatement {

        const unless = this.eat().type == TokenType.ShortUnlessOperator
        const condition = !unless ? this.find_expression() : {
            object: "Expression",
            kind: "LogicalNotExpression",
            target: this.find_expression()
        } as LogicalNotExpression
        let else_stmt: Statement = null
        if (this.at().type == TokenType.Colon && this.eat()) else_stmt = this.parse_statement()
        return {
            object: "Statement",
            kind: "ShortIfStatement",
            statement,
            condition,
            else: else_stmt
        } as ShortIfStatement

    }

    // ENVIRONMENT STATEMENTS

    private parse_environment_statement(is_root: boolean = false): Statement {

        if (!is_root) throw new HydroScriptParsingError("Environment statements must be in the root of a file")
        const identifier = this.next()
        if (identifier.value == "options") return this.parse_options_statement()
        else throw new HydroScriptParsingError("Unexpected environment statement name")

    }

    private parse_options_statement(): Statement {

        const colon1 = this.expect(TokenType.Colon)
        const options_identifier = this.expect(TokenType.Identifier)
        const colon2 = this.expect(TokenType.Colon)
        return {
            object: "Statement",
            kind: "OptionsStatement",
            options: this.parse_object_literal() as ObjectLiteral
        } as OptionsStatement

    }
}