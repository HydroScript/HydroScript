import StringLiteral from "../ast/string_literal"
import Expression from "../ast/expression"
import Program from "../ast/program"
import get_item from "../utils/get_item"
import DartCompiler from "./dart"
import JavaScriptCompiler from "./js"
import { HydroScriptCompileError } from "../error"

export default class Compiler {
    public static languages = [
        "javascript",
        "dart"
    ]

    public program: Program
    public compiler: JavaScriptCompiler | DartCompiler
    
    public compile(program: Program): string {
        this.program = program
        
        const option: Expression = (get_item(program.options.value, "to") ?? {
            object: "Expression",
            kind: "StringLiteral",
            mark: "\"",
            value: "javascript"
        } as StringLiteral)
        if (option.kind != "StringLiteral") throw new HydroScriptCompileError("\"to\" option is not a StringLiteral")
        
        const final_option = option as StringLiteral
        final_option.value = final_option.value.toLowerCase()
        if (!Compiler.languages.includes(final_option.value)) throw new HydroScriptCompileError("\"to\" option is not valid")

        switch (final_option.value) {
            case "javascript": {
                this.compiler = new JavaScriptCompiler()
                break
            }
            default:
                throw new HydroScriptCompileError("Language not implemented")
        }

        return this.compiler.compile(this.program)
    }
}