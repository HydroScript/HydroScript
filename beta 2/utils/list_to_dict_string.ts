export default function list_to_dict_string(list: { key: string, value: any }[], value_func: Function): string {
    if (!list[0]) return "{  }"
    const items = list.map(({ key, value }) => `${key}: ${value_func(value)}`)
    return `{ ${items.join(", ")} }`
}