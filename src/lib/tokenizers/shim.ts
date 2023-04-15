export class TokenizerHandle {
  worker: Worker
  constructor(worker: Worker) {
    this.worker = worker

    worker.addEventListener("error", console.error) // todo handle error
    worker.addEventListener("messageerror", console.error) // todo handle error
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
