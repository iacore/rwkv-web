import init, { TokenizerWasm } from "./tokenizers-wasm.js"

const tokenizer_promise: () => Promise<TokenizerWasm> = async () => {
  const req = fetch("/20B_tokenizer.json")
  await init(new URL("./tokenizers-wasm_bg.wasm", import.meta.url))
  const tok_config = await (await req).text()
  return new TokenizerWasm(tok_config)
}

const tokenizer = await tokenizer_promise()

self.postMessage(["loaded"])
