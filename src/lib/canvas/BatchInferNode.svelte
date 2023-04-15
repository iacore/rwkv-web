<script lang="ts">
import { store_server, store_tokenizer } from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode, { type ExNodeData } from "./ExNode.svelte"

export let data: ExNodeData

let prompt = ""
let tokens: number[]

$: {
  if (prompt == "") tokens = []
  else {
    let tok = $store_tokenizer
    if (tok) {
      async function tokenize_go() {
        tokens = Array.from((await tok!.encode(prompt, true)))
      }

      tokenize_go()
    }
  }
}

$: can_submit = $store_server && tokens.length != 0

async function submit() {
  const server = $store_server!
  const res = await server.postInfer(tokens, null)
  console.log(res)
}
</script>

<ExNode title="Infer" data="{data}" on:neodrag:start on:neodrag on:neodrag:end>
  <svelte:fragment slot="content">
    <label>state <input type="text" disabled /></label>
    <label>prompt <textarea rows="6" bind:value="{prompt}"></textarea></label>
    <label>tokens <input type="text" disabled value="{tokens}" /></label>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline" on:click="{submit}" disabled="{!can_submit}"
      >Submit</button
    >
  </svelte:fragment>
</ExNode>
