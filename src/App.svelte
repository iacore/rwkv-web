<script lang="ts">
import { onMount } from "svelte"
import inspect from "object-inspect";
import { RWKVClient } from "./lib/api"
import Canvas from "./lib/Canvas.svelte"
import ModelInfo from "./lib/ModelInfo.svelte"
import { store_server, store_tokenizer } from "./lib/stores"
import { load as loadTokenizer, TokenizerHandle } from "./lib/tokenizers/shim"
import TopLevel from "./lib/TopLevel.svelte"
import {
  promiseStateFancyString,
  promiseToStore
} from "./lib/util"

let server = "http://localhost:5000"

let {
  state: tok_state,
  data: tok_data,
  error: tok_error,
} = promiseToStore<TokenizerHandle>(loadTokenizer(), {
  data: store_tokenizer,
})

let srv_state, srv_data, srv_error
function retry(server: string) {
  store_server.set(undefined)
  let { state, data, error } = promiseToStore(RWKVClient.load(server), {
    data: store_server,
  })
  srv_state = state
  srv_data = data
  srv_error = error
}
$: retry(server)

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
  <header class="flex gap-4 justify-between items-center">
    <span id="site-icon"
      >RWKV<small class="italic text-[.5em] -ml-1">Δ</small></span
    >
    <span
      >Server
      <code class="whitespace-nowrap"
        >[{promiseStateFancyString($srv_state)}]</code
      ><button class="btn-inline mr-1" on:click="{() => retry(server)}"
        >Retry</button
      ><input type="text" bind:value="{server}" />
    </span>
    <span
      >Tokenizer <code class="whitespace-nowrap"
        >[{promiseStateFancyString($tok_state)}]</code
      ></span
    >
  </header>
  <hr />
  <ModelInfo data="{$store_server?.info}" />
  <div>
    {#if $tok_state == "rejected"}
      <p class="px-1 pb-1">
        Error when loading tokenizer<br /><span class="text-hl"
          >{inspect($tok_error)}</span
        >
      </p>
    {/if}
    {#if $srv_state == "rejected"}
      <p class="px-1 pb-1">
        Error when connecting to server<br /><span class="text-hl"
          >{inspect($srv_error)}</span
        >
      </p>
    {/if}
  </div>
  <hr />
  <TopLevel />
  <hr />
  <Canvas />
</div>

<style lang="postcss">
#app-root {
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(7, auto) 1fr;
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
  margin-top: calc(-3.3rem);
}
</style>
