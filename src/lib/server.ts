import { encode as msgEncode, decode as msgDecode } from "@msgpack/msgpack"

export class RWKVServer {
    static async load(base: URL | string): Promise<RWKVServer> {
        const res = await fetch(new URL("/info", base))
        const data = msgDecode(await res.arrayBuffer())
        console.log(data)
        return new RWKVServer()
    }
}
