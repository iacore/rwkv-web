import init, { TokenizerWasm } from "./tokenizers-wasm.js"

class UnhandledMessage {
  ev: any
  constructor(ev: any) {
    this.ev = ev
  }
}

const tokenizer_p = (async () => {
  const req = fetch("/20B_tokenizer.json")
  await init(new URL("./tokenizers-wasm_bg.wasm", import.meta.url))
  const tok_config = await (await req).text()
  return new TokenizerWasm(tok_config)
})()

self.onmessage = async (ev: MessageEvent) => {
  const id = ev.data[0]
  const evtype = ev.data[1] as string
  switch (evtype) {
    case "encode":
      const encoding = (await tokenizer_p).encode(ev.data[2], ev.data[3])
      self.postMessage([id, "encode_response", encoding.input_ids])
      break
    case "decode":
      const decoded = (await tokenizer_p).decode(ev.data[2], ev.data[3])
      self.postMessage([id, "decode_response", decoded])
      break
    case "ping":
      self.postMessage([id, "pong", ...ev.data.slice(2)])
      break
    default:
      self.reportError(new UnhandledMessage(ev))
  }
}
