import { writable, type Writable, type Readable } from "svelte/store"

export type PromiseState = "pending" | "fulfilled" | "rejected"

export type PromiseStore<T> = {
  state: Readable<PromiseState>
  data: Readable<T | undefined>
  error: Readable<any | undefined>
}

export function promiseToStore<T>(p: Promise<T>): PromiseStore<T> {
  const state: Writable<PromiseState> = writable("pending")
  const data: Writable<T | undefined> = writable()
  const error = writable()

  p.then((d) => {
    data.set(d)
    state.set("fulfilled")
  }).catch((e) => {
    error.set(e)
    state.set("rejected")
  })

  return {
    state,
    data,
    error,
  }
}

export function promiseStateFancyString(s: PromiseState): string {
  switch (s) {
    case "pending":
      return "LOAD"
    case "fulfilled":
      return " OK "
    case "rejected":
      return "FAIL"
  }
}
