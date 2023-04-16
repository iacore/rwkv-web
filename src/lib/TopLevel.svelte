<script>
import { nanoid } from "nanoid"
import { get } from "svelte/store"
import { extraInit } from "./canvas/BatchInferNode.svelte"
import {
  resetState,
  state_canvas,
  state_nodes,
  store_temperature,
  store_top_p,
} from "./stores"

function newInfer() {
  const {x, y} = get(state_canvas)
  state_nodes.update((o) => {
    o.items.push({
      id: nanoid(),
      type: "infer",
      x: 16 + Math.random() * 16 - x,
      y: 16 + Math.random() * 16 - y,
      stacking: Math.max(...o.items.map((n) => n.stacking)) + 1,
      ...extraInit,
    })
    return o
  })
}
</script>

<div class="flex justify-between items-stretch flex-wrap gap-y-[1px]">
  <span><button class="btn-inline" on:click="{newInfer}">New</button></span>
  <span class="flex items-stretch"
    ><span class="sampler-params-label"><span>SAMPLER<br />PARAMS</span></span>
    <label
      ><abbr
        title="Temperature. 1=baseline, higher=creative, lower=conservative"
        >temp</abbr
      >
      <input
        class="w-16"
        type="number"
        step="0.05"
        bind:value="{$store_temperature}"
      /></label
    ><label
      ><abbr
        title="Only sample the top cummulative `top_p` tokens. 1=consider all, 0=consider none"
        >top_p</abbr
      >
      <input
        class="w-[4em]"
        type="number"
        step="0.05"
        min="0"
        max="1"
        bind:value="{$store_top_p}"
      /></label
    ><button class="btn-inline" on:click="{(e) => alert('TODO')}">About</button
    ><button class="btn-inline" on:click="{resetState}">Reset</button></span
  >
</div>

<style>
.sampler-params-label {
  @apply isolate text-center leading-none text-[1em] inline-block px-1 h-[1.5em] mt-[-3px];
  transform-origin: top;
}
.sampler-params-label span {
  @apply bg-background;
}
</style>
