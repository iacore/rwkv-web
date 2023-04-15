<script lang="ts">
import type { TokenizerWasm } from "$lib/tokenizer_shim"
import type { RWKVServer } from "./server"

export let server: RWKVServer
export let tokenizer: TokenizerWasm
</script>

{tokenizer.encode("hello").input_ids}

<style>
</style>
