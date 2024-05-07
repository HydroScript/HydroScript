export default class Component {
    public raw: string
    public data: Record<string, any>

    constructor(raw: string = "", extra: Record<string, any> = {}) {
        this.raw = raw
        this.data = extra
    }

    toString(): string {
        return this.raw
    }
}