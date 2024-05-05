import Expression from "../ast/expression"

export default function get_item(list: { key: string, value: Expression }[], key: string): Expression | null {
    const kc = ((key.startsWith("\"") && key.endsWith("\"")) || (key.startsWith("'") && key.endsWith("'"))) ? key : `"${key}"`
    return (list.filter(item => item.key == kc)[0] ?? { value: null }).value
}