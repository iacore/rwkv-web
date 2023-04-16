<script lang="ts" context="module">
import { nanoid } from "nanoid"
import { onMount } from "svelte"
import { get } from "svelte/store"

export const extraInit = {
  state: null,
  prompt: "",
  tokens: new Uint32Array(),
}
</script>

<script lang="ts">
import { getTokenizer, state_nodes, store_client, store_tokenizer } from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import { spawnToRight, type NodeState_Infer } from "./state"
import StateViz from "./StateViz.svelte"

export let data: NodeState_Infer

onMount(async () => {
  update(await getTokenizer())
})

function update(tok : TokenizerHandle | undefined) {
  if (data.prompt == "") data.tokens = new Uint32Array()
  else {
    if (tok) {
      async function tokenize_go() {
        data.tokens = await tok!.encode(data.prompt, true)
        state_nodes.save()
      }

      tokenize_go()
    }
  }
}

$: can_submit = $store_client && data.tokens.length != 0

async function submit() {
  const server = $store_client!
  const { logits, state } = await server.postInfer(data.tokens, data.state)
  spawnToRight(data, {
    type: "result",
    logits,
    state,
    next: null,
  })
}
</script>

<ExNode title="Batch Inference" data="{data}">
  <svelte:fragment slot="content">
    <span>state <StateViz data="{data.state}" /></span>
    <label
      >prompt <textarea rows="6" bind:value="{data.prompt}" on:input={()=>update($store_tokenizer)}></textarea></label
    >
    <label>tokens <input type="text" disabled value="{data.tokens}" /></label>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline" on:click="{submit}" disabled="{!can_submit}"
      >Go▶</button
    >
  </svelte:fragment>
</ExNode>
