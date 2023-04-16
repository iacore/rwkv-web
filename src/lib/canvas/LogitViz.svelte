<script lang="ts">
import { preselect } from "../math"
import PromiseString from "../PromiseString.svelte"
import { store_temperature, store_tokenizer, store_top_p } from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"

export let data: Float32Array
export let considered: { i: number; p: number }[] = []
export let value: number | any

$: {
  considered = preselect(data, $store_temperature, $store_top_p)
}

async function decode(tok: TokenizerHandle, x: number): Promise<string> {
	return await tok.decode([x])
}
</script>

<div class="flex justify-stretch">
  {#each considered as choice}
    <button
			class="group"
      class:text-hl="{choice.i === value}"
      style:flex-grow="{choice.p}"
      on:click="{() => (value = choice.i)}"
      ><span class="absolute top-0 group-hover:bg-hl"><PromiseString data={$store_tokenizer && decode($store_tokenizer, choice.i)}/></span></button
    >
  {/each}
</div>

<style lang="postcss">
button {
  @apply text-start relative truncate isolate border-l -mr-[1px];
  &:hover {
    @apply overflow-auto z-10 text-text;
  }
}
button:last-child {
  @apply border-r;
}
</style>
