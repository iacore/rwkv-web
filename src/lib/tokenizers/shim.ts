import type { EncodingWasm } from "./tokenizers-wasm"

export class TokenizerHandle {
  nextid = 0
  worker: Worker
  dispatch: Map<number, (ev: MessageEvent<any>) => void> = new Map()

  constructor(worker: Worker) {
    this.worker = worker

    worker.addEventListener("error", console.error) // todo handle error
    worker.addEventListener("messageerror", console.error) // todo handle error
    worker.addEventListener("message", (ev) => {
      const id = ev.data[0]
      const f = this.dispatch.get(id)
      // console.log(ev, f)
      if (f) {
        f(ev)
        this.dispatch.delete(id)
      }
    })
  }

  encode(prompt: string, add_special_tokens: boolean): Promise<Uint32Array> {
    return new Promise((res) => {
      const id = this.nextid++
      this.dispatch.set(id, (ev) => {
        res(ev.data[2])
      })
      this.worker.postMessage([id, "encode", prompt, add_special_tokens])
    })
  }

  decode(tokens: ArrayLike<number>, skip_special_tokens: boolean): Promise<String> {
    return new Promise((res) => {
      const id = this.nextid++
      this.dispatch.set(id, (ev) => {
        res(ev.data[2])
      })
      this.worker.postMessage([id, "decode", prompt, skip_special_tokens])
    })
  }
}

export const load: () => Promise<TokenizerHandle> = () => {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  })
  return new Promise((res, rej) => {
    worker.addEventListener("error", rej)
    worker.addEventListener("messageerror", rej)
    worker.addEventListener(
      "message",
      (e) => {
        res(new TokenizerHandle(worker))
      },
      {
        once: true,
      }
    )
  })
}
