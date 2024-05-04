declare module "hydroscript" {

    /**
     * Compiles the code given
     * @param CODE The HydroScript code
     * @param path The path to show when showing an error, defaults to "<unknown>"
     * @returns The compiled JavaScript
     */
    export function compile(CODE: string): string

    /**
     * The version code for the package
     */
    export function parse(CODE: string): {
        object: "Program"
        kind: "Program",
        body: Record<string, any>[],
        options: {
            object: "Expression",
            kind: "ObjectLiteral",
            value: { key: string, value: any }[]
        }
    }

    /**
     * Parses the code given
     * @param CODE The HydroScript code
     * @param path The path to show when showing an error, defaults to "<unknown>"
     * @returns The Abstract Syntax Tree (AST) of the parsed code
     */
    export function repl(): Promise<void>

    /**
     * Compiles code to Temp directory and executes it
     * Only works if you have provided the arguments when running "node" command in console
     */
    export function run(): void

    /**
     * Lexes (tokenizes) the code given
     * @param CODE The HydroScript code
     * @param path The path to show when showing an error, defaults to "<unknown>"
     * @returns The list of tokens from the code
     */
    export function lex(CODE: string): {
        object: "Token",
        value: string,
        type: number,
        line: number
    }[]

    /**
     * The version code of the package
     */
    export const version: string

    /**
     * The HydroScript error classes
     */
    export const errors: Record<string, any>

    /**
     * Default exports, same as all regular exports as an object
     */
    export default {
        compile,
        parse,
        lex,
        repl,
        run,
        version,
        errors
    }

}