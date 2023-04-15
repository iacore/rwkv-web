<script lang="ts">
import type { TokenizerWasm } from "$lib/tokenizer_shim"
import { setContext } from "svelte"
import Canvas from "./Canvas.svelte"
import ModelInfo from "./ModelInfo.svelte"
import type { RWKVServer } from "./server"

export let server: RWKVServer
export let tokenizer: TokenizerWasm

setContext("server", server)
setContext("tokenizer", tokenizer)
</script>

<div id="app-inner">
  <ModelInfo data="{server.info}" />

  <hr />

  <Canvas />
</div>

<style>
#app-inner {
  display: grid;
  grid-template-rows: auto auto 1fr;
}
</style>
