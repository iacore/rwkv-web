import init, { TokenizerWasm } from "./tokenizers-wasm.js"

const tokenizer_promise: () => Promise<TokenizerWasm> = async () => {
  const req = fetch("/20B_tokenizer.json")
  await init(new URL("./tokenizers-wasm_bg.wasm", import.meta.url))
  const tok_config = await (await req).text()
  return new TokenizerWasm(tok_config)
}

class UnhandledMessage {
  ev: any
  constructor(ev: any) {
    this.ev = ev
  }
}

async function go() {
  const tokenizer = await tokenizer_promise()

  self.postMessage([-1, "loaded"])
  self.addEventListener("message", (ev) => {
    const id = ev.data[0]
    const evtype = ev.data[1] as string
    switch (evtype) {
      case "encode":
        const encoding = tokenizer.encode(ev.data[2], ev.data[3])
        self.postMessage([id, "encode_response", encoding.input_ids])
        break
      case "decode":
        const decoded = tokenizer.decode(ev.data[2], ev.data[3])
        self.postMessage([id, "decode_response", decoded])
        break
      default:
        self.reportError(new UnhandledMessage(ev))
    }
  })
}

go()
