import Expression from "../ast/expression"

export default function get_item(list: { key: string, value: Expression }[], key: string): Expression | null {
    return (list.filter(item => item.key == key)[0] ?? { value: null }).value
}