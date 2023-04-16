import { get, writable, type Writable } from "svelte/store"
import { nanoid } from "nanoid"
import { debounce } from "lodash"
import * as localForage from "localforage";

import type { RWKVClient } from "./api"
import type { TokenizerHandle } from "./tokenizers/shim"
import type { NodeState } from "./canvas/mod"
import { extraInit as extraInit_Infer } from "./canvas/BatchInferNode.svelte"

export const store_server: Writable<RWKVClient | undefined> = writable()
export const store_tokenizer: Writable<TokenizerHandle | undefined> = writable()

export const store_temperature = writable(1.0)
export const store_top_p = writable(0.85)

export type Resetable<T> = Writable<T> & { reset(): void; save(): void }

export function storedSimple<T>(key: string, init: () => T): Resetable<T> {
  const stored = localStorage.getItem(key)

  const content = writable(
    stored === null
      ? init()
      : (() => {
          try {
            return JSON.parse(stored)
          } catch {
            return init()
          }
        })()
  ) as Resetable<T>

  const save = debounce((value: T) => {
    return localStorage.setItem(key, JSON.stringify(value))
  }, 1000);

  content.save = function () {
    save(get(this))
  }
  content.reset = function () {
    this.set(init())
  }

  let __first = true
  content.subscribe((value) => {
    if (__first) {
      __first = false
      return
    }
    save(value)
  })

  return content
}

localForage.config({
  driver: localForage.INDEXEDDB,
  name: "rwkvd",
  version: 1,
})

export async function storedComplex<T>(key: string, init: () => T): Promise<Resetable<T>> {
  const stored = await localForage.getItem(key)

  const content = writable(
    stored === null
      ? init()
      : stored
  ) as Resetable<T>

  const save = debounce(async (value: T) => {
    await localForage.setItem(key, value)
  }, 1000);

  content.save = function () {
    save(get(this))
  }
  content.reset = function () {
    this.set(init())
  }

  let __first = true
  content.subscribe((value) => {
    if (__first) {
      __first = false
      return
    }
    save(value)
  })

  return content
}

export function resetState() {
  state_canvas.reset()
  state_nodes.reset()
}

export const state_canvas = storedSimple("state.canvas", () => ({ x: 0, y: 0 }))

export type State_Nodes = {
  items: NodeState[]
}
export const state_nodes = await storedComplex(
  "state.nodes",
  (): State_Nodes => ({
    items: [
      {
        id: nanoid(),
        type: "infer",
        x: 100,
        y: 40,
        stacking: 0,
        ...extraInit_Infer,
      },
    ],
  })
)
