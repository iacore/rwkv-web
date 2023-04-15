import { writable, type Writable } from "svelte/store"
import type { RWKVServer } from "./server"
import type { TokenizerWasm } from "./tokenizer_shim"

export const store_server: Writable<RWKVServer | undefined> = writable()
export const store_tokenizer: Writable<TokenizerWasm | undefined> = writable()
