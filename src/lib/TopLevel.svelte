<script>
import { store_temperature, store_top_p } from "./stores"
</script>

<div class="flex justify-between items-stretch flex-wrap gap-y-[1px]">
  <span
    ><button class="btn-inline -mr-[1px]">Infer anew</button><button
      class="btn-inline -mr-[1px]">Foo</button
    ></span
  >
  <span class="flex items-stretch"
    ><span class="sampler-params-label"><span>SAMPLER<br>PARAMS</span></span>
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
    ><button class="btn-inline">About</button></span
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