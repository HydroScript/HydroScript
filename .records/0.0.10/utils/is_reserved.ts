import Reserved from "../data/js_reserved"

export function is_reserved(str: string): boolean {
    for (const reserved in Reserved) if (str == reserved || str.startsWith(add_suffix(reserved))) return true
    return false
}

export function add_suffix(str: string): string {
    return `${str}${is_reserved(str) ? "_1" : ""}`
}