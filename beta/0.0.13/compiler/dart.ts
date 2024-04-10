import Program from "../ast/program"
import { HydroScriptCompileError } from "../error"

export default class DartCompiler {
    public compile(program: Program): string {
        throw new HydroScriptCompileError("Dart compiler is not implemented")
    }
}