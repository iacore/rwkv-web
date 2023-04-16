<script lang="ts">
import { onMount, onDestroy } from "svelte"
import { get } from "svelte/store"
import type { RWKVClient } from "../api"
import { preselect, random_choice } from "../math"
import {
  getClient,
  state_nodes,
  store_client,
  store_tokenizer,
} from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import LogitViz from "./LogitViz.svelte"
import type { NodeState_Stream } from "./state"
import StateViz from "./StateViz.svelte"

export let data: NodeState_Stream

let infinite = false
let pending = 0
let accumulated = ""

async function nextToken(client: RWKVClient) {
  // console.log("logits", data.logits)
  const choices = preselect(data.logits, 1, 0.85)
  // console.log("choices", choices)
  const token_id = random_choice(choices)
  // console.log("id", token_id)
  accumulated += await $store_tokenizer!.decode([token_id], true)
  const res = await client.postInfer([token_id], data.state)
  data.state = res.state
  data.logits = res.logits
  data = data
}

let stop = false

onDestroy(() => {
  stop = true
})

onMount(() => {
  async function go() {
    while (!stop) {
      const client = get(store_client)
      if (client && (infinite || pending > 0)) {
        if (pending > 0) pending--
        await nextToken(client)
      } else {
        await new Promise((res) => requestAnimationFrame(res))
      }
    }
  }
  go()
})
</script>

<ExNode title="Streaming Inference" data="{data}" wip="{true}">
  <svelte:fragment slot="content">
    <span>state <StateViz data="{data.state}" /></span>
    <span
      >logits <LogitViz data="{data.logits}" bind:value="{data.next}" /></span
    >
    <span>res <textarea rows="10" value="{accumulated}"></textarea></span>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <span class:text-hl="{pending != 0}">{pending}⧗</span>
    <label class="checkbox-inline"
      >infinite<input type="checkbox" bind:value="{infinite}" /></label
    >
    <button class="btn-inline" on:click="{() => pending++}">Next</button>
  </svelte:fragment>
</ExNode>
