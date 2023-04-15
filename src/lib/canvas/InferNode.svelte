<script lang="ts">
import { store_server, store_tokenizer } from "../stores"
import ExNode, { type ExNodeData } from "./ExNode.svelte"

export let data: ExNodeData

let prompt = ""
let tokens: number[]

$: {
  if (prompt == "") tokens = []
  else {
    let tok = $store_tokenizer
    if (tok) {
      tokens = Array.from(tok.encode(prompt, true).input_ids)
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
    <div><label>state <input type="text" disabled /></label></div>
    <div><label>prompt <input type="text" bind:value="{prompt}" /></label></div>
    <div>
      <label>tokens <input type="text" disabled value="{tokens}" /></label>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline" on:click="{submit}" disabled="{!can_submit}"
      >Submit</button
    >
  </svelte:fragment>
</ExNode>
