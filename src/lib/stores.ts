import { writable, type Writable } from "svelte/store"
import type { RWKVClient } from "./api"
import type { TokenizerWasm } from "./tokenizer_shim"

export const store_server: Writable<RWKVClient | undefined> = writable()
export const store_tokenizer: Writable<TokenizerWasm | undefined> = writable()

export const store_temperature = writable(1.0)
export const store_top_p = writable(0.85)
