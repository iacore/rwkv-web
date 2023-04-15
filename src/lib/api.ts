import { encode as msgEncode, decode as msgDecode } from "@msgpack/msgpack"

export type ModelInfo = {
  model_path: string
  vocab_count: number
  state_count: number
}

export type InferResponse = {
  logits: Float32Array
  state: Uint8Array
}

export class RWKVClient {
  static async load(base: URL | string): Promise<RWKVClient> {
    const client = new RWKVClient(new URL(base), undefined)
    const model_info = await client.getModelInfo()
    client.info = model_info
    return client
  }

  base: URL
  info: ModelInfo

  constructor(base: URL, info: ModelInfo) {
    this.base = base
    this.info = info
  }

  async getModelInfo(): Promise<ModelInfo> {
    const res = await fetch(new URL("/info", this.base))
    const model_info = msgDecode(await res.arrayBuffer())
    return model_info as ModelInfo
  }

  async postInfer(
    tokens: number[],
    state: Uint8Array | null
  ): Promise<InferResponse> {
    const res = await fetch(new URL("/infer", this.base), {
      method: "POST",
      body: msgEncode({ tokens, state }),
    })
    const data = msgDecode(await res.arrayBuffer()) as {
      logits: Uint8Array
      state: Uint8Array
    }

    return {
      logits: new Float32Array(data.logits.buffer),
      state: data.state,
    }
  }
}
