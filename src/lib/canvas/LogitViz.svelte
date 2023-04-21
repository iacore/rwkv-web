<script lang="ts">
import { get } from "svelte/store"
import { preselect } from "../math"
import PromiseString from "../PromiseString.svelte"
import {
  getTokenizer,
  store_temperature,
  store_top_p,
} from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"

export let data: Float32Array | undefined
export let considered: { i: number; p: number }[] = []
export let value: number | any = null

$: {
  if (data != undefined)
    considered = preselect(data, $store_temperature, $store_top_p)
}

async function decode(tok: TokenizerHandle, x: number): Promise<string> {
  return await tok.decode([x], true)
}
</script>

{#await getTokenizer()}
  <span>No Tokenizer</span>
{:then tok}
  {#if data == undefined}
    <abbr title="no logits"> ∅ </abbr>
  {:else}
    <div class="flex justify-stretch isolate">
      {#each considered.slice(0, 512) as choice}
        <button
          class="group hover:bg-hl"
          class:text-hl="{choice.i === value}"
          style:flex-grow="{choice.p}"
          on:click="{() => (value = choice.i)}"
          ><span class="token-text group-hover:bg-hl group-hover:top-[-100%]"
            ><PromiseString data="{decode(tok, choice.i)}" /></span
          ></button
        >
      {/each}
    </div>
  {/if}
{/await}

<style lang="postcss">
button {
  @apply text-start relative truncate -mr-[2px] border-y border-l bg-background;

  &:hover {
    @apply overflow-auto z-10 text-text;
  }
}
.token-text {
  @apply absolute top-0;
  pointer-events: none;
}
</style>
