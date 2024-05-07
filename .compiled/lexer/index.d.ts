declare module "hydroscript/lexer" {

    /**
     * Checks if a string with length of 1 is an alphabet
     * @param src The source string
     * @returns Whether it is an alphabet
     */
    export function is_alpha(src: string): boolean

    /**
     * Checks if a string can be used as identifier
     * @param src The source string
     * @returns Whether it can be used as identifier
     */
    export function can_use_in_indentifier(src: string): boolean

    /**
     * Checks if a string with length of 1 is a number
     * @param src The source string
     * @returns Whether it is a number
     */
    export function is_int(src: string): boolean

    /**
     * Checks if a string is a HydroScript operator
     * @param src The source string
     * @returns Whether it is a HydroScript operator
     */
    export function is_operator(src: string): boolean

    /**
     * Checks if a string with length of 1 is skippable
     * @param src The source string
     * @returns Whether it is skippable
     */
    export function is_skippable(src: string): boolean

    /**
     * Creates a Token object with given parameters
     * @param value The value of the token
     * @param type The token type
     * @param line The line number of the token from source code
     * @param column The column number of the token from source code
     * @returns The Token object
     */
    export function token(value: string, type: number, line: number, column: number): Record<string, any>

    /**
     * Tokenizes (lexes) the given source code
     * @param code The source code
     * @param path The path to show in occurence of an error, leave as "<unknown>" if unknown or unused
     */
    export function tokenize(code: string, path: string): Record<string, any>[]

}