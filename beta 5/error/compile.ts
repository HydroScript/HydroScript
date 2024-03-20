class HydroScriptCompileError extends Error {
    public name = "HydroScriptCompileError"

    constructor(message: string) {
        super(message)
    }
}

export default HydroScriptCompileError