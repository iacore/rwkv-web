<script lang="ts" context="module">
export const extraInit = {
  state: null,
  prompt: "",
  tokens: [],
}
</script>

<script lang="ts">
import { state_nodes, store_server, store_tokenizer } from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import type { NodeState_Infer } from "./mod"

export let data: NodeState_Infer

const onInput = (ev) => {
  console.log(ev)
  data.prompt = ev.target.value
  if (data.prompt == "") data.tokens = []
  else {
    let tok = $store_tokenizer
    if (tok) {
      async function tokenize_go() {
        data.tokens = Array.from(await tok!.encode(data.prompt, true))
        state_nodes.save()
      }

      tokenize_go()
    }
  }
}

$: can_submit = $store_server && data.tokens.length != 0

async function submit() {
  const server = $store_server!
  const { logits, state } = await server.postInfer(data.tokens, data.state)
  state_nodes.update((o) => {
    o.items.push({
      type: "result",
      x: data.x + 340,
      y: data.y,
      stacking: data.stacking + 1,
      logits,
      state,
      next: null,
    })
    return o
  })
}
</script>

<ExNode title="Batch Inference" data="{data}">
  <svelte:fragment slot="content">
    <label>state <input type="text" disabled /></label>
    <label
      >prompt <textarea rows="6" value="{data.prompt}" on:input="{onInput}"
      ></textarea></label
    >
    <label>tokens <input type="text" disabled value="{data.tokens}" /></label>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline" on:click="{submit}" disabled="{!can_submit}"
      >Submit</button
    >
  </svelte:fragment>
</ExNode>
