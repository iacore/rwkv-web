/*
Inference Cache
===============

Design
------

You can think of the cache as Map<InferKey, InferResult>


Algorithm for finding cached response to a prompt
---------

### algorithm 1: naive

tokens: [a, b, c]
tokens: [a, b]
tokens: [a]

### algorithm 2: use sorted nature of keys

search all keys in desc order from [a, b, c] to [a]

This is faster when we have prompts with 1000 tokens stored, but less than 1000 prompts stored.

pruning
-------

prune old cache by log step
find branch points in a tree

naive: LRU
maybe it will be fast enough
*/

import { z } from "zod"

const schema = z.object({
  model: z.string(), // model hash
  tokens: z
    .instanceof(Uint32Array)
    .and(z.custom((data: Uint32Array) => data.length > 0)),
  state: z.instanceof(Uint8Array),
  logits: z.instanceof(Float32Array),
})

export type InferCacheRow = z.infer<typeof schema>

import Dexie from "dexie"
import { liveQuery } from "dexie"
import type { ModelHash } from "./api"

const db = new Dexie("myDatabase")
db.version(1).stores({
  infercache: "[model+tokens]",
})
const table = db.table<InferCacheRow, [ModelHash, Uint32Array]>("infercache")

export async function add(row: InferCacheRow) {
  row = schema.parse(row)
  return await table.put(row)
}

import { assert } from "chai"
export async function getExact(model: ModelHash, tokens: Uint32Array) {
  return await table.get([model, tokens])
}

export async function getBestMatch(model: ModelHash, tokens: Uint32Array) {
  assert(tokens.length > 0)
  const record = await table
    .where(["model", "tokens"])
    .between([model, new Uint32Array([tokens[0]])], [model, tokens], true, true)
    .reverse()
    .first()
  return record
}
