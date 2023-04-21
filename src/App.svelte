<script lang="ts">
import { onMount } from "svelte"
import { get, writable } from "svelte/store"
import { RWKVClient } from "./lib/api"
import Canvas from "./lib/Canvas.svelte"
import LoadStatus from "./lib/LoadStatus.svelte"
import ModelInfo from "./lib/ModelInfo.svelte"
import { store_client, getTokenizer } from "./lib/stores"
import { load as loadTokenizer } from "./lib/tokenizers/shim"
import TopLevel from "./lib/TopLevel.svelte"
import {
  inspect,
  type PromiseState,
  promiseToStore,
} from "./lib/util"

let server = "http://localhost:5000"

let tok_state = writable<PromiseState>("pending"),
  tok_error = writable(undefined)

onMount(async () => {
  try {
    await getTokenizer()
    tok_state.set("fulfilled")
  } catch (e) {
    tok_state.set("rejected")
    tok_error.set(e)
  }
})

let srv_state, srv_data, srv_error
function retry(server: string) {
  store_client.set(undefined)
  let { state, data, error } = promiseToStore(RWKVClient.load(server), {
    data: store_client,
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
</script>

<div id="app-root">
  <header>
    <div id="site-icon">RWKV<small class="text-[.5em] -ml-1">Δ</small></div>
    <div class="global-controls flex flex-wrap gap-x-2">
      <span>Tokenizer <LoadStatus state="{$tok_state}" /></span>
      <span
        >Server <LoadStatus state="{$srv_state}" /><button
          class="btn-inline"
          title="Reconnect"
          on:click="{() => retry(server)}">↻</button
        ></span
      >
      <label><span class="sr-only">Server Address</span><input type="text" bind:value="{server}" /></label>
    </div>
  </header>
  <hr />
  <ModelInfo data="{$store_client?.info}" />
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
  display: grid;
  grid-template-columns: auto auto 1fr;
  @apply gap-2 items-center;
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
