import { get, writable, type Readable, type Writable } from "svelte/store"
import { nanoid } from "nanoid"
import { debounce } from "lodash"
import { createInstance as createLocalForage, INDEXEDDB } from "localforage"

import * as cache from "./cache"
import type { RWKVClient } from "./api"
import { type TokenizerHandle, load as loadTokenizer } from "./tokenizers/shim"
import type { NodeState } from "./canvas/types"
import { extraInit as extraInit_Infer } from "./canvas/BatchInferNode.svelte"

// setup
const localForage = createLocalForage({
  driver: INDEXEDDB,
  name: "rwkvd-localforage",
  version: 1,
  storeName: "ui",
})

// tokenizer
let tok_p: Promise<TokenizerHandle>
export const getTokenizer = () => {
  if (!tok_p) tok_p = loadTokenizer()
  return tok_p
}

// networking-related
export const store_client: Writable<RWKVClient | undefined> = writable()
export const getClient = createStoreGetter(store_client)

// global params
export const store_temperature = storedSimple("params.temperature", () => 1.0)
export const store_top_p = storedSimple("params.top_p", () => 0.85)

// ui state
export const state_canvas = storedSimple("ui.canvas", () => ({ x: 0, y: 0 }))
export type UiState_Nodes = {
  items: NodeState[]
}
export const state_nodes = storedComplex(
  "ui.nodes",
  (): UiState_Nodes => ({
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

// other api

/** reset cache and ui state */
export async function resetState() {
  localStorage.clear()
  await Promise.all([cache.reset(), localForage.clear()])
  location.reload()
}

// util functions

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

export type Resetable<T> = Writable<T> & { reset(): void; save(): void }

function storedSimple<T>(key: string, init: () => T): Resetable<T> {
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

function storedComplex<T>(
  key: string,
  init: () => T,
  stub: T
): Resetable<T> {
  const content = writable(stub) as Resetable<T>
  const storedPromise = localForage.getItem<T>(key)

  const save = debounce(async (value: T) => {
    console.debug("saved: " + key)
    await localForage.setItem(key, value)
  }, 1000)

  content.save = function () {
    console.debug("save triggered: " + key)
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
