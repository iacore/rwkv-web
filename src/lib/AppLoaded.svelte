<script lang="ts">
import type { TokenizerWasm } from "$lib/tokenizer_shim"
import ModelInfo from "./ModelInfo.svelte"
import type { RWKVServer } from "./server"

export let server: RWKVServer
export let tokenizer: TokenizerWasm
</script>


<ModelInfo data={server.info} />

<hr>

// {tokenizer.encode("hello").input_ids}

<style>
</style>
