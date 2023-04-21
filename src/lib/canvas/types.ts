import { nanoid } from "nanoid"
import { state_nodes } from "../stores"
import { get } from "svelte/store"

export type BaseNodeState = {
  id: string
  x: number
  y: number
  stacking: number
  el_width?: number
  el_height?: number
}

export type Base_Infer = {
  type: "infer"
  seen_tokens: number[]
  prompt: string
}
export type NodeState_Infer = Base_Infer & BaseNodeState

export type Base_Result = {
  type: "result"
  seen_tokens: number[]
  next: number | null
}
export type NodeState_Result = Base_Result & BaseNodeState

export type Base_Analysis = {
  type: "analysis"
  logits: Float32Array
}
export type NodeState_Analysis = Base_Analysis & BaseNodeState

export type Base_Stream = {
  type: "stream"
  seen_tokens: number[]
}
export type NodeState_Stream = Base_Stream & BaseNodeState

export type Base = Base_Infer | Base_Result | Base_Analysis | Base_Stream
export type NodeState =
  | NodeState_Infer
  | NodeState_Result
  | NodeState_Analysis
  | NodeState_Stream

export function spawn<T extends Base>(
  data: BaseNodeState,
  offset: { x: number; y: number },
  extra: T /* todo: type this properly */
) {
  state_nodes.update((o) => {
    o.items.push({
      x: data.x + offset.x,
      y: data.y + offset.y,
      stacking: createMaxStacking() + 1,
      id: nanoid(),
      ...extra,
    })
    return o
  })
}

export function spawnToRight<T extends Base>(
  data: BaseNodeState,
  extra: T /* todo: type this properly */
) {
  return spawn(data, { x: (data.el_width ?? 324) + 16, y: 0 }, extra)
}

export function spawnToDown<T extends Base>(
  data: BaseNodeState,
  extra: T /* todo: type this properly */
) {
  return spawn(data, { x: 0, y: (data.el_height ?? 128) + 16 }, extra)
}

export function createMaxStacking() {
  return Math.max(
    0,
    ...get(state_nodes).items.map((o) => o.stacking--)
  )
}
