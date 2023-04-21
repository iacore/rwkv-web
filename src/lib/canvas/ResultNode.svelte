<script lang="ts">
import {
  getClient,
  getTokenizer,
} from "../stores"
import ExNode from "./ExNode.svelte"
import LogitViz from "./LogitViz.svelte"
import {
  spawn,
  spawnToDown,
  spawnToRight,
  type NodeState_Result,
} from "./types"
import StateViz from "./StateViz.svelte"

export let data: NodeState_Result

let state: Uint8Array | undefined = undefined
let logits: Float32Array | undefined = undefined

$: (async (seen_tokens) => {
  const client = await getClient()
  const res = await client.getCached(seen_tokens)
  if (res != undefined) {
    state = res.state
    logits = res.logits
  }
})(data.seen_tokens)

let word: string | null = null

const update = async (token_id) => {
  const tok = await getTokenizer()
  word = await tok.decode([token_id], true)
}

$: {
  if (data.next != null) {
    update(data.next)
  } else {
    word = null
  }
}

function onInput(ev) {
  data.next = ev.target.value == null ? null : Number(ev.target.value)
}

async function forceNext(next: number | null) {
  if (next == null) return
  const client = await getClient()
  const tokens = [...data.seen_tokens, next]
  await client.inferFromZero(tokens)
  spawnToRight(data, {
    type: "result",
    seen_tokens: tokens,
    next: null,
  })
}
</script>

<ExNode title="Infer Result" data="{data}">
  <svelte:fragment slot="content">
    <span>state <StateViz data="{state}" /></span>
    <span>logits <LogitViz data="{logits}" bind:value="{data.next}" /></span>
    <span
      >next <span class="flex gap-1">
        <input
          type="number"
          class="w-16"
          min="0"
          max="{logits ? logits.length : 0}"
          value="{data.next}"
          on:input="{onInput}"
        />
        {#if word != null}
          <span>{word}</span>
        {:else}
          <abbr title="no token selected">∅</abbr>
        {/if}
      </span></span
    >
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <!-- <button class="btn-inline" on:click={() => spawnToRight(data, {
      type: "analysis",
      logits: data.logits,
    })}>Analysis</button> -->
    <button
      class="btn-inline"
      on:click="{() =>
        spawnToDown(data, {
          type: 'infer',
          seen_tokens: data.seen_tokens,
          prompt: '',
        })}">Batch▼</button
    >
    <button
      class="btn-inline"
      on:click="{() =>
        spawnToDown(data, {
          type: 'stream',
          seen_tokens: data.seen_tokens,
        })}">Stream▼</button
    >
    <button
      class="btn-inline"
      on:click="{() => forceNext(data.next)}"
      disabled="{data.next == null}"
      ><abbr title="Force next token">Force▶</abbr></button
    >
  </svelte:fragment>
</ExNode>
