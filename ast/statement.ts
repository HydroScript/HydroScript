import { objects } from "../data/objects"
import { NodeType } from "./node_type"

export default interface Statement {
    object: objects
    kind: NodeType
}