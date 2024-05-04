import reserved from "../data/js_reserved"
import libraryReserved from "../data/hys_reserved"

const Reserved = Object.assign({}, reserved, libraryReserved)

export function is_reserved(str: string): boolean {
    for (const reserved in Reserved) if (str == reserved || str.startsWith(`${reserved}_1`)) return true
    return false
}

export function add_suffix(str: string): string {
    return `${str}${is_reserved(str) ? "_1" : ""}`
}