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

export type NodeState = NodeState_Infer | NodeState_Result
