import { nanoid } from "nanoid"
import { state_nodes } from "../stores"

export type BaseNodeState = {
  id: string
  x: number
  y: number
  stacking: number
}

export type NodeState_Infer = {
  type: "infer"
  state: Uint8Array | null,
  prompt: string,
  tokens: Uint32Array,
} & BaseNodeState

export type NodeState_Result = {
  type: "result"
  state: Uint8Array,
  logits: Float32Array,
  next: number | null,
} & BaseNodeState

export type NodeState_Analysis = {
  type: "analysis"
  logits: Float32Array,
} & BaseNodeState

export type NodeState_Stream = {
  type: "stream"
  state: Uint8Array,
  logits: Float32Array,
} & BaseNodeState

export type NodeState = NodeState_Infer | NodeState_Result | NodeState_Analysis | NodeState_Stream


export function spawnToRight<T>(data: BaseNodeState, extra: Partial<NodeState> /* todo: type this properly */) {
  state_nodes.update((o) => {
    o.items.push({
      x: data.x + 340,
      y: data.y,
      stacking: data.stacking + 1,
      id: nanoid(),
      ...extra
    })
    return o
  })
}
