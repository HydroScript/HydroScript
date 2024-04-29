class HydroScriptInternalError extends Error {
    public name = "HydroScriptInternalError"

    constructor(message: string) {
        super(message)
    }
}

export default HydroScriptInternalError