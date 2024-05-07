export default class HydroScriptExecuteError extends Error {
    public name = "HydroScriptExecuteError"

    constructor(message: string) {
        super(message)
    }
}