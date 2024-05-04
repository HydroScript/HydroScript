import Program from "../ast/program"
import Expression from "../ast/expression"
import Identifier from "../ast/identifier"
import NumericLiteral from "../ast/numeric_literal"
import BinaryExpression from "../ast/binary_expression"
import { TokenType } from "../lexer/token_type"
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

import { Token, token, tokenize } from "../lexer"

import remove_quotations from "../utils/remove_quotations"

export default class Parser {
    private tokens: Token[] = []

    private is_in_function: boolean = false

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
        if (!previous || previous.type != type) throw new Error(`wrong expect, want ${type}, is ${JSON.stringify(previous)} (${previous.type})`)
        return previous
    }

    private expect_multiple(types: TokenType[]): Token {
        const previous = this.eat()
        if (!previous || !types.includes(previous.type)) throw new Error(`wrong expect, want ${types.join(" or ")}, is ${previous.type}`)
        return previous
    }

    public produce(code: string): Program {

        this.tokens = tokenize(code)
        
        const statements: Statement[] = []

        while (!this.is_end()) statements.push(this.parse_statement())

        return {
            object: "Program",
            kind: "Program",
            body: statements
        } as Program

    }

    // PRIMARY

    public parse_expression(): Expression {
        return this.parse_assignment_expression()
    }

    public find_expression(): Expression {
        const expr = this.parse_statement()
        if (expr.object != "Expression") throw new Error("unexpected statement, expected expression")
        return expr as Expression
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

        if (operator != "$") return this.parse_primary_expression()

        this.eat()
        return {
            object: "Expression",
            kind: "TypeOfExpression",
            target: this.parse_logical_not_expression()
        } as TypeOfExpression

    }

    private parse_primary_expression(): Expression {

        const token_type = this.at().type
        let expression = ((): Expression => {

            if (token_type == TokenType.Identifier || token_type == TokenType.Number) {

                switch (token_type) {
                    case TokenType.Identifier:
                        return this.parse_identifier()
                    case TokenType.Number:
                        return this.parse_numeric_literal()
                }

            } else if (token_type == TokenType.Function || token_type == TokenType.AsyncFunction) {

                return this.parse_function_literal()

            } else if (token_type == TokenType.Class) {

                return this.parse_class_literal()

            } else if (token_type == TokenType.OpenParenthesis) {

                const open = this.eat()
                const value = this.find_expression()
                const close = this.expect(TokenType.CloseParenthesis)
                return value as Expression

            } else if (token_type == TokenType.Await) {

                return this.parse_await_expression()

            } else if (token_type == TokenType.String) {

                return this.parse_string_literal()

            } else if (token_type == TokenType.OpenCurlyBracket) {

                const next = this.next().type
                const next2 = this.next(2).type
                if ((next == TokenType.Identifier || next == TokenType.String) && next2 == TokenType.Colon) return this.parse_object_literal()
                
            }

            throw new Error(`unexpected token ${token_type} (${TokenType[token_type]})`)

        })()

        while (true && expression.object == "Expression") {
            const next_token = this.at()
            if (next_token) {
                if (next_token.type == TokenType.OpenParenthesis) expression = this.parse_function_call_expression(expression as Expression)
                else if (next_token.type == TokenType.Dot || next_token.type == TokenType.OpenSquareBracket) expression = this.parse_member_call_expression(expression as Expression)
                else break
            }
            else break
        }

        return expression
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

    private parse_object_literal(): Expression {

        const open = this.eat()
        const values: Record<string, string | Expression>[] = []
        while (true) {

            if (this.at().type == TokenType.CloseCurlyBracket) break
            const key = this.expect_multiple([
                TokenType.String,
                TokenType.Identifier
            ]).value
            const colon = this.expect(TokenType.Colon)
            if (!this.next()) throw new Error("cannot find value in object literal declaration")
            const value = this.find_expression()
            if (this.at().type == TokenType.Comma) this.eat()
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

    private parse_member_call_expression(expression: Expression): Expression {
        
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

            } else throw new Error("internal error: invalid token type presented")
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
            arguments: this.parse_function_call_arguments()
        } as FunctionCallExpression

    }

    private parse_function_call_arguments(): (Expression | Token)[] {

        const open = this.expect(TokenType.OpenParenthesis)
        let args: (Expression | Token)[] = []
        if (this.at().type != TokenType.CloseParenthesis) args = this.parse_function_call_arguments_list()
        const close = this.expect(TokenType.CloseParenthesis)
        return args

    }

    private parse_function_call_arguments_list(): (Expression | Token)[] {

        const args = [ this.find_expression() ]
        while (!this.is_end() && this.at().type == TokenType.Comma && this.eat()) args.push(this.find_expression())
        return args

    }

    // SECONDARY

    private parse_statement(options: Record<string, any> = {}): Statement {
        
        if (this.at().type == TokenType.Import) return this.parse_import_statement()
        if (this.at().type == TokenType.Static) return this.parse_static_property_declaration(options.in_class ?? false)

        const statement: Expression = this.parse_expression()
        let result: Statement = statement
        
        while (result.object == "Expression") {
            if (this.at().type == TokenType.QuestionMark) {
                result = this.parse_if_statement(result as Expression)
                continue
            } else if (this.at().type == TokenType.While) {
                result = this.parse_while_statement(result as Expression)
                break
            }
            else break
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
        const default_constructor = {
            object: "Expression",
            kind: "FunctionLiteral",
            parameters: [],
            body: {
                object: "Statement",
                kind: "Block",
                body: []
            } as Block,
            async: false
        } as FunctionLiteral
        let constructor = default_constructor
        const initializers: Identifier[] = []
        const definitions: AssignmentExpression[] = []

        const statements: Statement[] = []
        while (true) {
            const current = this.at()
            if (current.object == "Token" && current.type == TokenType.CloseCurlyBracket) break
            const statement = this.parse_statement({ in_class: true })
            if (statement.object == "Statement" && statement.kind != "StaticPropertyDeclaration") throw new Error("found statement, which is also not a StaticPropertyDeclaration, instead of expression while parsing class definition")
            statements.push(statement)
        }
        const end = this.expect(TokenType.CloseCurlyBracket)

        for (let i = 0; i <= statements.length - 1; i++) {
            const current = statements[i]
            if (current.kind == "StaticPropertyDeclaration") statics.push(current as StaticPropertyDeclaration)
            else if (current.kind == "AssignmentExpression") {
                if ((current as AssignmentExpression).operator != "=") throw new Error("the assignment operator in class definition is not =")
                definitions.push(current as AssignmentExpression)
            }
            else if (current.kind == "FunctionLiteral") {
                if (constructor != default_constructor) throw new Error("a class definition cannot contain two or more constructors")
                if ((current as FunctionLiteral).async) throw new Error("constructor cannot be async")
                constructor = current as FunctionLiteral
            }
            else if (current.kind == "Identifier") initializers.push(current as Identifier)
            else throw new Error("found expression of type other than AssignmentExpression, FunctionLiteral and Identifier")
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
        let extending: Identifier | null = null
        if (this.at().type == TokenType.Extends) {
            const extends_keyword = this.expect(TokenType.Extends)
            extending = this.parse_identifier()
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

    private parse_static_property_declaration(in_class: boolean): StaticPropertyDeclaration {

        if (!in_class) throw new Error("found static property declaration outside of class block")
        const operator = this.expect(TokenType.Static)
        const expression = this.parse_expression()
        if (expression.kind != "AssignmentExpression") throw new Error("expression is not of type AssignmentExpression")
        return {
            object: "Statement",
            kind: "StaticPropertyDeclaration",
            expression
        } as StaticPropertyDeclaration

    }

    private parse_if_statement(expression: Expression): Statement {

        const mark = this.expect(TokenType.QuestionMark)
        const body = this.parse_block()
        let else_body: Block = {
            object: "Statement",
            kind: "Block",
            body: []
        }

        const current = this.at()
        if (current && current.object == "Token" && current.type == TokenType.Colon) {
            const colon = this.expect(TokenType.Colon)
            else_body = this.parse_block()
        }

        if (
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

    private open_curly_bracket(): Statement {
        return this.parse_block()
    }

    private parse_function_literal(): Expression {

        const sign = this.expect_multiple([ TokenType.Function, TokenType.AsyncFunction ])
        return {
            object: "Expression",
            kind: "FunctionLiteral",
            parameters: this.parse_function_parameters(),
            body: this.parse_block(),
            async: sign.value == ">>-"
        } as FunctionLiteral

    }

    private parse_function_parameters(): (Expression | Token)[] {

        const open = this.expect(TokenType.OpenParenthesis)
        let params: (Expression | Token)[] = []

        const current = this.at()
        if (!(current.object == "Token" && current.type != TokenType.CloseParenthesis)) params = this.parse_function_parameters_list()

        const close = this.expect(TokenType.CloseParenthesis)
        return params

    }

    private parse_function_parameters_list(): (Expression | Token)[] {

        const params = [ this.parse_identifier() ]

        const condition = (): boolean => {
            return Boolean(!this.is_end() && (this.at().type == TokenType.Comma) && this.eat())
        }
        while (condition()) params.push(this.parse_identifier())

        return params

    }
}