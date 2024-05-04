declare module "hydroscript/parser" {

    /**
     * The Parser class of the language
     */
    export default class Parser {
        constructor(path: string)
        public produce(code: string): {
            object: "Program"
            kind: "Program",
            body: Record<string, any>[],
            options: {
                object: "Expression",
                kind: "ObjectLiteral",
                value: { key: string, value: any }[]
            }
        }
        public parse_expression(): {
            object: "Expression"
        }
        public parse_statement(): {
            object: "Statement" | "Expression"
        }
    }

}