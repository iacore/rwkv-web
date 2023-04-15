<script lang="ts">
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
import { store_server, store_tokenizer } from "./lib/stores"
import ModelInfo from "./lib/ModelInfo.svelte"
import Canvas from "./lib/Canvas.svelte"

let server = "http://localhost:5000"

let {
  state: tok_state,
  data: tok_data,
  error: tok_error,
}: PromiseStore<TokenizerWasm> = promiseToStore(tokenizer_promise(), {
  data: store_tokenizer,
})

let srv_state, srv_data, srv_error
$: {
  let { state, data, error } = promiseToStore(RWKVServer.load(server), {
    data: store_server,
  })
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

function setContext(arg0: string, srv_data: any) {
  throw new Error("Function not implemented.")
}
</script>

<div id="app-root">
  <header class="flex gap-4 justify-between">
    <span id="site-icon">RWKV</span>
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

  <div>
    {#if $tok_state == "rejected"}
      <p>
        Error when loading tokenizer<br /><span class="text-hl"
          >{$tok_error}</span
        >
      </p>
    {/if}
    {#if $srv_state == "rejected"}
      <p>
        Error when connecting to server<br /><span class="text-hl"
          >{$srv_error}</span
        >
      </p>
    {/if}
  </div>

  <ModelInfo data="{$store_server?.info}" />

  <hr />

  <Canvas />
</div>

<style>
#app-root {
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(5, auto) 1fr;
}

#app-root > * {
  vertical-align: text-bottom;
}

header {
  overflow: hidden;
}

#site-icon {
  font-size: 3.3rem;
  height: 1.5rem;
  font-variation-settings: "MONO" 0.5, "slnt" -9;
  font-weight: 650;
  margin-top: calc(-0.53 * 3.3rem);
}
</style>
