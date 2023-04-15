import init, { TokenizerWasm } from "./tokenizers/tokenizers-wasm.js"

export { TokenizerWasm }

export const tokenizer_promise: Promise<TokenizerWasm> = (async () => {
  const req = fetch("/20B_tokenizer.json")
  await init(new URL("./tokenizers/tokenizers-wasm_bg.wasm", import.meta.url))
  const tok_config = await (await req).text()
  return new TokenizerWasm(tok_config)
})()
