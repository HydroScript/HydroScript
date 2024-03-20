import { NodeType } from "../ast/node_type"
import { objects } from "../data/objects"

type valid = objects | NodeType

export default function format_parsing_error(expected: valid | valid[], got: valid, line?: number | [ number, number ]): string {
    return `${line ? `Line ${typeof line == "number" ? line : line.map(String).join(" to ")}: ` : ""}Expected ${
        typeof expected == "object" ?
            expected.join(" or ") :
            expected
    }, got ${got}`
}