<script lang="ts">
import AppLoaded from "./lib/AppLoaded.svelte"
import { type TokenizerWasm, tokenizer_promise } from "./lib/tokenizer_shim"
import { onMount } from "svelte"

let server = "http://localhost:5000"

let a: Promise<TokenizerWasm> = new Promise(() => {})

onMount(() => {
  a = tokenizer_promise()
})
// import Counter from './lib/Counter.svelte'
</script>

<main>
  <h1>RWKV frontend</h1>

  Server<input type="text" bind:value="{server}" />

  {#await a}
    Loading tokenizer...
  {:then tokenizer}
    <AppLoaded server="{new URL(server)}" tokenizer="{tokenizer}" />
  {/await}

  <!-- <button>whta</button> -->
</main>

<style>
</style>
