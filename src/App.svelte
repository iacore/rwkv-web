<script lang="ts">
import AppLoaded from "./lib/AppLoaded.svelte"
import { type TokenizerWasm, tokenizer_promise } from "./lib/tokenizer_shim"
import { onMount } from "svelte"
import { handle_promise } from "svelte/internal"
import {
  promiseStateFancyString,
  promiseToStore,
  type PromiseStore,
} from "./lib/util"
import { get } from "svelte/store"
import { RWKVServer } from "./lib/server"

let server = "http://localhost:5000"

let {
  state: tok_state,
  data: tok_data,
  error: tok_error,
}: PromiseStore<TokenizerWasm> = promiseToStore(tokenizer_promise())

let srv_state, srv_data, srv_error
$: {
  let { state, data, error } = promiseToStore(RWKVServer.load(server))
  srv_state = state
  srv_data = data
  srv_error = error
}

$: {
  if ($tok_error) {
    console.error($tok_error)
  }
}
$: {
  if ($srv_error) {
    console.error($srv_error)
  }
}

onMount(() => {})
// import Counter from './lib/Counter.svelte'
</script>

<header class="flex gap-4 justify-between">
  <h1>RWKV Web</h1>
  <span
    >Server
    <input type="text" bind:value="{server}" />
    <button
      class="border px-1 ml-0.5 -my-1"
      on:click="{() => {
        server = server
      }}">Retry</button
    >
    <code class="whitespace-nowrap"
      >[{promiseStateFancyString($srv_state)}]</code
    >
  </span>
  <span
    >Tokenizer <code class="whitespace-nowrap"
      >[{promiseStateFancyString($tok_state)}]</code
    ></span
  >
</header>

<hr />

{#if $tok_state == "fulfilled" && $srv_state == "fulfilled"}
  <AppLoaded server="{get(srv_data)}" tokenizer="{get(tok_data)}" />
{:else}
  <div>
    {#if $tok_state != "rejected" && $srv_state != "rejected"}
      <p>Loading...</p>
    {/if}
    {#if $tok_state == "rejected"}
      <p>
        Error when loading tokenizer<br /><span class="text-hl"
          >{$tok_error}</span
        >
      </p>
    {/if}
    {#if $srv_state == "rejected"}
      <p>
        Error when connected to server<br /><span class="text-hl"
          >{$srv_error}</span
        >
      </p>
    {/if}
  </div>
{/if}

<style>
</style>
