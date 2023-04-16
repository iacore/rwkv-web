<script lang="ts">
import { preselect, random_choice } from "../math"
import { state_nodes, store_server, store_tokenizer } from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import type { NodeState_Stream } from "./state"

export let data: NodeState_Stream

let infinite = false
let pending = 0
let accumulated = ""

async function nextToken() {
  // console.log("logits", data.logits)
  const choices=preselect(data.logits,1,0.85);
  // console.log("choices", choices)
  const token_id = random_choice(choices)
  // console.log("id", token_id)
  accumulated += await $store_tokenizer!.decode([token_id], true)
  const res = await $store_server!.postInfer([token_id], data.state)
  data.state = res.state
  data.logits = res.logits
}
</script>

<ExNode title="Streaming Inference" data="{data}" wip="{true}">
  <svelte:fragment slot="content">
    <span>res <textarea rows="10" value="{accumulated}"></textarea></span>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <span class:text-hl={pending != 0}>{pending}⧗</span>
    <label class="checkbox-inline">infinite<input type="checkbox" bind:value={infinite}></label>
    <button class="btn-inline" on:click="{() => pending++}">Next</button>
  </svelte:fragment>
</ExNode>
