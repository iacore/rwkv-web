export type NodeState_Infer = {
  type: "infer"
}

export type NodeState_Result = {
  type: "result"
}

export type NodeState = NodeState_Infer | NodeState_Result
