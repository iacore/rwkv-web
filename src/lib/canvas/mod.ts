import type { ExNodeData } from "./ExNode.svelte"

export type NodeState_Infer = {
  type: "infer"
  // todo
} & ExNodeData

export type NodeState_Result = {
  type: "result"
  // todo
} & ExNodeData

export type NodeState = NodeState_Infer | NodeState_Result
