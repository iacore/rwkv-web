import { encode as msgEncode, decode as msgDecode } from "@msgpack/msgpack"
import * as cache from "./cache"
import { assert } from "chai"

export type ModelHash = string

export type ModelInfo = {
  model_hash: ModelHash
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
    const client = new RWKVClient(new URL(base), undefined!)
    const model_info = await client.getModelInfo()
    client.info = model_info
    return client
  }

  base: URL
  info!: ModelInfo

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
    tokens: Uint32List,
    state: Uint8Array | null
  ): Promise<InferResponse> {
    const res = await fetch(new URL("/infer", this.base), {
      method: "POST",
      body: msgEncode({ tokens: Array.from(tokens), state }),
    })

    const data = msgDecode(await res.arrayBuffer()) as {
      logits: Uint8Array
      state: Uint8Array
    }

    const logits = new Float32Array(data.logits.slice().buffer)
    // console.log("infer res", logits, data.logits)

    return {
      logits: logits,
      state: data.state,
    }
  }

  async getCached(tokens: Uint32List): Promise<cache.InferCacheRow | undefined> {
    const model = this.info.model_hash
    return await cache.getExact(model, Array.from(tokens))
  }

  async inferFromZero(tokens_: Uint32List, noRequest = false): Promise<cache.InferCacheRow> {
    const model = this.info.model_hash
    const tokens = Array.from(tokens_)
    const cached = await cache.getBestMatch(model, tokens)
    console.log(cached, model, tokens)
    if (cached != undefined) {
      // exact match
      if (cached.tokens.length == tokens.length) return cached

      // otherwise, infer from last cached
      assert(!noRequest, "no cache. no request allowed")
      const result = await this.postInfer(
        tokens.slice(cached.tokens.length),
        cached.state
      )
      const row = {
        model,
        tokens,
        state: result.state,
        logits: result.logits,
        date: new Date(),
      }
      await cache.add(row)
      return row
    } else {
      // no cache at all
      assert(!noRequest, "no cache. no request allowed")
      const result = await this.postInfer(tokens, null)
      const row = {
        model,
        tokens,
        state: result.state,
        logits: result.logits,
        date: new Date(),
      }
      await cache.add(row)
      return row
    }
  }
}
