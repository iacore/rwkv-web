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
  const choices = preselect(data.logits, 1, 0.85)
  const token_id = random_choice(choices)

  const t0 = async () => {
    accumulated += await $store_tokenizer!.decode([token_id], true)
  }

  const t1 = async () => {
    const res = await client.postInfer([token_id], data.state)
    data.state = res.state
    data.logits = res.logits
  }

  await Promise.all([t0(), t1()])
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
    <span>state {#if infinite}<span>-</span>{:else}<StateViz data="{data.state}" />{/if}</span>
    <span
      >logits {#if infinite}<span>-</span>{:else}<LogitViz data="{data.logits}" />{/if}</span
    >
    <span>res <textarea rows="10" value="{accumulated}" disabled></textarea></span>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <span class:text-hl="{pending != 0}">{pending}⧗</span>
    <label class="checkbox-inline"
      >infinite<input type="checkbox" bind:checked="{infinite}" /></label
    >
    <button class="btn-inline" on:click="{() => pending++}">Next</button>
  </svelte:fragment>
</ExNode>
