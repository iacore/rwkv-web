<script lang="ts">
import { state_nodes, store_tokenizer } from "../stores"
import ExNode from "./ExNode.svelte"
import LogitViz from "./LogitViz.svelte"
import { spawnToRight, type NodeState_Result } from "./state"
import StateViz from "./StateViz.svelte"

export let data: NodeState_Result

let word: string | null = null

const update = (tok, token_id) => {
  if (tok) {
    tok.decode([token_id], true).then((decoded) => {
      word = decoded
    })
  }
}

$: {
  if (data.next != null) {
    update($store_tokenizer, data.next)
  } else {
    word = null
  }
}

function onInput(ev) {
  data.next = ev.target.value == null ? null : Number(ev.target.value)
}
</script>

<ExNode title="Infer Result" data="{data}">
  <svelte:fragment slot="content">
    <span>state <StateViz data="{data.state}" /></span>
    <span>logits <LogitViz data="{data.logits}" bind:value={data.next} /></span>
    <span
      >next <span class="flex gap-1">
        <input
          type="number"
          class="w-16"
          min="0"
          max="{data.logits.length}"
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
    <button class="btn-inline" on:click={() => spawnToRight(data, {
      type: "analysis",
      logits: data.logits,
    })}>Analysis</button>
    <button class="btn-inline" on:click={() => alert("todo")}>Batch▶</button>
    <button class="btn-inline" on:click={() => spawnToRight(data, {
      type: "stream",
      logits: data.logits,
      state: data.state,
    })}>Stream▶</button>
  </svelte:fragment>
</ExNode>
