import { nanoid } from "nanoid"
import { state_nodes } from "../stores"

export type BaseNodeState = {
  id: string
  x: number
  y: number
  stacking: number
  el_width?: number
  el_height?: number
}

export type NodeState_Infer = {
  type: "infer"
  state: Uint8Array | null,
  prompt: string,
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


export function spawn<T>(data: BaseNodeState, offset: {x: number, y: number}, extra: Partial<NodeState> /* todo: type this properly */) {
  state_nodes.update((o) => {
    o.items.push({
      x: data.x + offset.x,
      y: data.y + offset.y,
      stacking: data.stacking + 1,
      id: nanoid(),
      ...extra
    })
    return o
  })
}

export function spawnToRight<T>(data: BaseNodeState, extra: Partial<NodeState> /* todo: type this properly */) {
  return spawn(data, { x: (data.el_width ?? 324) + 16, y: 0 }, extra)
}
