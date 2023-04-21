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

export const schema = z.object({
  model: z.string(), // model hash
  tokens: z
    .array(z.number())
    .and(z.custom((data: ArrayLike<any>) => data.length > 0)),
  state: z.instanceof(Uint8Array),
  logits: z.instanceof(Float32Array),
  date: z.date(),
})

export type InferCacheRow = z.infer<typeof schema>

import Dexie from "dexie"
import { liveQuery } from "dexie"
import type { ModelHash } from "./api"

const db = new Dexie("rwkvd")
db.version(1).stores({
  infercache: "[model+tokens]",
})
const table = db.table<
  InferCacheRow,
  [InferCacheRow["model"], InferCacheRow["tokens"]]
>("infercache")

export async function reset() {
  await db.delete()
  await db.open()
}

export async function add(row: InferCacheRow) {
  row = schema.parse(row)
  return await table.put(row)
}

import { assert } from "chai"
export async function getExact(
  model: InferCacheRow["model"],
  tokens: InferCacheRow["tokens"]
) {
  return await table.get([model, tokens])
}

import { isEqual } from "lodash"

export async function getBestMatch(
  model: InferCacheRow["model"],
  tokens: InferCacheRow["tokens"]
) {
  assert(tokens.length > 0)
  const record = await table
    .where(["model", "tokens"])
    .between([model, [tokens[0]]], [model, tokens], true, true)
    .reverse()
    .filter(doc => {
      if (doc.tokens.length > tokens.length) {
        return false
      }
      return isEqual(tokens.slice(0, doc.tokens.length), doc.tokens)
    })
    .first()
  return record
}
