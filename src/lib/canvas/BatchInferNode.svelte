<script lang="ts" context="module">
import { onMount } from "svelte"

export const extraInit = {
  seen_tokens: [],
  prompt: "",
}
</script>

<script lang="ts">
import { getClient, getTokenizer, state_nodes, store_client } from "../stores"
import ExNode from "./ExNode.svelte"
import { spawnToRight, type Base_Result, type NodeState_Infer } from "./types"
import StateViz from "./StateViz.svelte"
import TokenViz from "./TokenViz.svelte"

export let data: NodeState_Infer

let tokens_set = false
let tokens: number[] = []

onMount(async () => {
  tokens_set = true
  await update()
})

async function update() {
  if (data.prompt == "") tokens = []
  else {
    const tok = await getTokenizer()
    tokens = Array.from(await tok.encode(data.prompt, true))
  }
  state_nodes.save()
}

$: can_submit = $store_client && tokens.length != 0

async function submit() {
  const client = await getClient()
  const allTokens = [...data.seen_tokens, ...tokens]
  await client.inferFromZero(allTokens)

  spawnToRight<Base_Result>(data, {
    type: "result",
    seen_tokens: allTokens,
    next: null,
  })
}
</script>

<ExNode title="Batch Inference" data="{data}">
  <svelte:fragment slot="content">
    <label
      >prompt <textarea rows="6" bind:value="{data.prompt}" on:input="{update}"
      ></textarea></label
    >
    <span
      >tokens {#if tokens_set}<TokenViz data="{tokens}" />{:else}<span>⧗</span
        >{/if}</span
    >
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline" on:click="{submit}" disabled="{!can_submit}"
      >Go▶</button
    >
  </svelte:fragment>
</ExNode>
