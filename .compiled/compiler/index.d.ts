declare module "hydroscript/compiler" {

    /**
     * The Compiler class of the language
     * Inputs a Program (Abstract Syntax Tree) and returns the compiled string
     */
    export default class Compiler {
        public compile(program: {
            object: "Program"
            kind: "Program",
            body: Record<string, any>[],
            options: {
                object: "Expression",
                kind: "ObjectLiteral",
                value: { key: string, value: any }[]
            }
        }): string
        public static languages: string[]
    }

}