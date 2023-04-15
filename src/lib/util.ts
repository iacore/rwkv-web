import { writable, type Writable } from "svelte/store"

export type PromiseState = "pending" | "fulfilled" | "rejected"

export type PromiseStore<T> = {
  state: Writable<PromiseState>
  data: Writable<T | undefined>
  error: Writable<any | undefined>
}

export function promiseToStore<T>(p: Promise<T>, opts?: Partial<PromiseStore<T>>): PromiseStore<T> {
  const state: Writable<PromiseState> = (opts && opts.state) || writable("pending")
  const data: Writable<T | undefined> = (opts && opts.data) || writable()
  const error = (opts && opts.error) || writable()

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

export function inspect(a: any): string {
  if ('message' in a) return a.message.toString()
  return a.toString()
}
