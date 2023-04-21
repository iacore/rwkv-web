<script lang="ts" context="module">
import { nanoid } from "nanoid"
import { onMount } from "svelte"
import { get } from "svelte/store"

export const extraInit = {
  seen_tokens: [],
  prompt: "",
}
</script>

<script lang="ts">
import {
  getClient,
  getTokenizer,
  store_client,
  store_tokenizer,
} from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import { spawnToRight, type Base_Result, type NodeState_Infer } from "./state"
import StateViz from "./StateViz.svelte"
import TokenViz from "./TokenViz.svelte"

export let data: NodeState_Infer

let tokens_set = false
let tokens: number[] = []

onMount(async () => {
  const tok = await getTokenizer()
  tokens_set = true
  update(tok)
})

function update(tok: TokenizerHandle | undefined) {
  if (data.prompt == "") tokens = []
  else {
    if (tok) {
      async function tokenize_go() {
        tokens = Array.from(await tok!.encode(data.prompt, true))
      }

      tokenize_go()
    }
  }
}

$: can_submit = $store_client && tokens.length != 0

async function submit() {
  const client = await getClient()
  const allTokens = [...data.seen_tokens,...tokens];
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
      >prompt <textarea
        rows="6"
        bind:value="{data.prompt}"
        on:input="{() => update($store_tokenizer)}"></textarea></label
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
