import { get, writable, type Readable, type Writable } from "svelte/store"
import { nanoid } from "nanoid"
import { debounce } from "lodash"
import { createInstance as createLocalForage, INDEXEDDB } from "localforage"

import type { RWKVClient } from "./api"
import type { TokenizerHandle } from "./tokenizers/shim"
import type { NodeState } from "./canvas/state"
import { extraInit as extraInit_Infer } from "./canvas/BatchInferNode.svelte"

const localForage = createLocalForage({
  driver: INDEXEDDB,
  name: "rwkvd-localforage",
  version: 1,
  storeName: "ui"
})

export const store_client: Writable<RWKVClient | undefined> = writable()
export const store_tokenizer: Writable<TokenizerHandle | undefined> = writable()

function createStoreGetter<T>(store: Readable<T>) {
  return function (): Promise<NonNullable<T>> {
    const current = get(store)
    if (current != undefined) return Promise.resolve(current)
    return new Promise((res) => {
      let unsubscribe
      unsubscribe = store.subscribe((value) => {
        if (value != undefined) {
          res(value)
          // hack
          if (unsubscribe) unsubscribe()
          else setTimeout(unsubscribe, 0)
        }
      })
    })
  }
}

export const getTokenizer = createStoreGetter(store_tokenizer)
export const getClient = createStoreGetter(store_client)

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
  }, 1000)

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

export function storedComplex<T>(
  key: string,
  init: () => T,
  stub: T
): Resetable<T> {
  const content = writable(stub) as Resetable<T>
  const storedPromise = localForage.getItem<T>(key)

  const save = debounce(async (value: T) => {
    console.debug("save")
    await localForage.setItem(key, value)
  }, 1000)

  content.save = function () {
    console.debug("save triggered")
    save(get(this))
  }
  content.reset = function () {
    this.set(init())
  }
  let __first = 2
  content.subscribe((value) => {
    if (value === undefined) return
    if (__first > 0) {
      __first--
      return
    }
    save(value)
  })

  const go = async () => {
    const stored = await storedPromise
    // console.log(stored)
    content.set(stored === null ? init() : stored)
  }
  go()

  return content
}

import * as cache from "./cache"

export function resetState() {
  cache.reset()
  state_canvas.reset()
  state_nodes.reset()
}

export const state_canvas = storedSimple("state.canvas", () => ({ x: 0, y: 0 }))

export type State_Nodes = {
  items: NodeState[]
}
export const state_nodes = storedComplex(
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
  }),
  {
    items: [],
  }
)
