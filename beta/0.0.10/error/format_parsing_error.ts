import { NodeType } from "../ast/node_type"
import { objects } from "../data/objects"
import { Token } from "../lexer"
import { TokenType } from "../lexer/token_type"

type valid = objects | NodeType | TokenType

export default function format_parsing_error(expected: valid | valid[], got: valid, line?: number, token?: Token): string {
    return `${line ? `Line ${line}: ` : ""}Expected ${
        typeof expected == "object" ?
            expected.join(" or ") :
            expected
    }, got ${got}${token ? " (${JSON.stringify(token)})" : ""}`
}