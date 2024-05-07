declare module "hydroscript/error" {

    /**
     * Internal error class
     */
    export class HydroScriptInternalError extends Error {
        public name: string
        constructor(message: string)
    }

    /**
     * Syntax error class
     */
    export class HydroScriptSyntaxError extends Error {
        public name: string
        public _display: string
        constructor(expected: null | number | number[], got: number | string, path: string, line?: number, colmun?: number, process_type?: number)
        toString(): string
    }

    /**
     * Parsing error class
     */
    export class HydroScriptParsingError extends Error {
        public name: string
        constructor(message: string)
    }

    /**
     * Compile error class
     */
    export class HydroScriptCompileError extends Error {
        public name: string
        constructor(message: string)
    }

    /**
     * Formats a parsing error message
     * @param expected Expected string or list of strings
     * @param got String got instead of expected string(s)
     * @param line Line number in source code
     * @param token The Token object that caused the error
     * @returns The formatted string
     */
    export function format_parsing_error(expected: string | string[], got: string, line?: number, token?: Record<string, any>): string

}