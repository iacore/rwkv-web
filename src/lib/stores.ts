import { serialize, deserialize } from "god-tier-serializer"
import { writable, type Writable } from "svelte/store"
import type { RWKVClient } from "./api"
import type { TokenizerHandle } from "./tokenizers/shim"
import type { NodeState } from "./canvas/mod"

export const store_server: Writable<RWKVClient | undefined> = writable()
export const store_tokenizer: Writable<TokenizerHandle | undefined> = writable()

export const store_temperature = writable(1.0)
export const store_top_p = writable(0.85)

export type Resetable<T> = Writable<T> & { reset(): void }

export function stored<T>(key: string, init: () => T): Resetable<T> {
  const stored = localStorage.getItem(key)

  const content = writable(
    stored === null
      ? init()
      : (() => {
          try {
            return deserialize(stored)
          } catch {
            return init()
          }
        })()
  ) as Resetable<T>
  content.subscribe((value) => localStorage.setItem(key, serialize(value)))
  content.reset = function () {
    this.set(init())
  }
  return content
}

export function resetState() {
  state_canvas.reset()
}

export const state_canvas = stored("state.canvas", () => ({ x: 0, y: 0 }))

export type State_Nodes = {
  items: NodeState[]
}
export const state_nodes = stored(
  "state.nodes",
  (): State_Nodes => ({ items: [] })
)
