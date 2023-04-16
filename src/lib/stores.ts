import { get, writable, type Writable } from "svelte/store"
import { nanoid } from "nanoid"

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

  function save(value: T) {
    return localStorage.setItem(key, JSON.stringify(value))
  }
  content.save = function () {
    save(get(this))
  }
  content.reset = function () {
    this.set(init())
  }

  window.addEventListener("beforeunload", () => {
    content.save()
  })

  return content
}

export function storedComplex<T>(key: string, init: () => T): Resetable<T> {
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

  function save(value: T) {
    // JSON.stringify()
    // localStorage.setItem()
    // todo: do this faster
    // return localStorage.setItem(key, JSON.stringify(value))
  }
  content.save = function () {
    save(get(this))
  }
  content.reset = function () {
    this.set(init())
  }

  window.addEventListener("beforeunload", () => {
    content.save()
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
      {
        // for dev
        id: nanoid(),
        type: "infer",
        x: 100,
        y: 340,
        stacking: 0,
        ...extraInit_Infer,
      },
      // {
      //   type: "result",
      //   x: 100,
      //   y: 340,
      //   stacking: 0,
      //   // todo
      //   // this default node is temporary for development
      // },
    ],
  })
)
