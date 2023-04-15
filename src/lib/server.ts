import { encode as msgEncode, decode as msgDecode } from "@msgpack/msgpack"

export type ModelInfo = {
    model_path: string,
    vocab_count: number,
    state_count: number,
}

export class RWKVServer {
    static async load(base: URL | string): Promise<RWKVServer> {
        const res = await fetch(new URL("/info", base))
        const model_info = msgDecode(await res.arrayBuffer())
        return new RWKVServer(new URL(base), model_info)
    }

    base: URL
    info: ModelInfo

    constructor(base: URL, info: ModelInfo) {
        this.base = base
        this.info = info
    }
}
