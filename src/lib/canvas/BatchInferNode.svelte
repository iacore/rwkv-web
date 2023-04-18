<script lang="ts" context="module">
import { nanoid } from "nanoid"
import { onMount } from "svelte"
import { get } from "svelte/store"

export const extraInit = {
  state: null,
  prompt: "",
}
</script>

<script lang="ts">
import {
  getClient,
  getTokenizer,
  state_nodes,
  store_client,
  store_tokenizer,
} from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import { spawnToRight, type Base_Result, type NodeState_Infer } from "./state"
import StateViz from "./StateViz.svelte"
import TokenViz from "./TokenViz.svelte"

export let data: NodeState_Infer
let state: Uint8Array | null = null
$: (async (seen_tokens) => {
  // todo: decide when/how requests will be triggered
  // maybe add a refresh button here?
  // todo: add a refresh button
  const client = await getClient()
  const res = await client.inferFromZero(seen_tokens)
  state = res.state
})(data.seen_tokens)

let tokens_set = false
let tokens = new Uint32Array()

onMount(async () => {
  const tok = await getTokenizer()
  tokens_set = true
  update(tok)
})

function update(tok: TokenizerHandle | undefined) {
  if (data.prompt == "") tokens = new Uint32Array()
  else {
    if (tok) {
      async function tokenize_go() {
        tokens = await tok!.encode(data.prompt, true)
        // state_nodes.save()
      }

      tokenize_go()
    }
  }
}

$: can_submit = $store_client && tokens.length != 0

async function submit() {
  spawnToRight<Base_Result>(data, {
    type: "result",
    seen_tokens: [...data.seen_tokens, ...tokens],
    next: null,
  })
}
</script>

<ExNode title="Batch Inference" data="{data}">
  <svelte:fragment slot="content">
    <span>state <StateViz data="{state}" /></span>
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
