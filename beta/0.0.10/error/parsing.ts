class HydroScriptParsingError extends Error {
    public name = "HydroScriptParsingError"

    constructor(message: string) {
        super(message)
    }
}

export default HydroScriptParsingError