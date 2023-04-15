<script lang="ts">
import type { TokenizerWasm } from "$lib/tokenizer_shim"

export let server: URL
export let tokenizer: TokenizerWasm
</script>

{tokenizer.encode("hello").input_ids}

<style>
</style>
