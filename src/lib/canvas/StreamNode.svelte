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

async function nextToken(client: RWKVClient, logits: Float32Array) {
  const choices = preselect(logits, 1, 0.85)
  const token_id = random_choice(choices)
  data.seen_tokens.push(token_id)

  return await client.inferFromZero(data.seen_tokens)
}

let stop = false

onDestroy(() => {
  stop = true
})

onMount(() => {
  async function go() {
    {
      const text = await $store_tokenizer!.decode(data.seen_tokens, true)
      accumulated = text
    }
    const client = await getClient()
    let logits = (await client.getCached(data.seen_tokens))?.logits
    while (!stop) {
      if (logits && client && (infinite || pending > 0)) {
        if (pending > 0) pending--
        const res = await nextToken(client, logits)
        logits = res.logits
        state_nodes.save()
        const text = await $store_tokenizer!.decode(data.seen_tokens, true)
        accumulated = text
      } else {
        await new Promise((res) => requestAnimationFrame(res))
      }
    }
  }
  go()
})
</script>

<ExNode title="Streaming Inference" data="{data}">
  <svelte:fragment slot="content">
    <span
      >out <textarea rows="10" value="{accumulated}" disabled></textarea></span
    >
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <span class:text-hl="{pending != 0}">{pending}⧗</span>
    <label class="checkbox-inline"
      >infinite<input type="checkbox" bind:checked="{infinite}" /></label
    >
    <button class="btn-inline" on:click="{() => pending++}">Next</button>
  </svelte:fragment>
</ExNode>
