import "fake-indexeddb/auto"
import { IDBFactory } from "fake-indexeddb"

import { assert, expect, test, beforeEach } from "vitest"
import * as fc from "fast-check"

import * as cache from "../src/lib/cache"


const fcToken = fc.integer({min: 0, max: 65535})
const fcRow = fc.record({
  model: fc.string(),
  tokens: fc.array(fcToken, { minLength: 1 }),
  date: fc.date(),
  state: fc.uint8Array(),
  logits: fc.float32Array(),
})


const clearDb = async () => {
  global.indexedDB = new IDBFactory()
  await cache.reset()
}
beforeEach(clearDb)

test("has indexedDB", () => {
  expect(global).toHaveProperty("indexedDB")
})

test("can insert text", async () => {
  await fc.assert(
    fc.asyncProperty(fcRow, async (row) => {
      const [model_hash1, tokens1] = await cache.add(row)
      expect(model_hash1).toEqual(row.model)
      expect(tokens1).toEqual(row.tokens)
    })
  )
})

test("meta: indexDB is cleared before each test", async () => {
  await fc.assert(
    fc.asyncProperty(
      fcRow,
      async (row) => {
        const res = await cache.getBestMatch(row.model, row.tokens)
        expect(res).toBeUndefined()
      }
    ).beforeEach(clearDb)
  )
})

test("best match", async () => {
  await fc.assert(
    fc.asyncProperty(
      fcRow,
      fcToken,
      fcToken,
      async (row, tok0, tok1) => {
        // interval test
        await cache.add({ ...row, model: "aaa" })
        await cache.add({ ...row, model: "aac" })
        expect(await cache.getBestMatch("aab", row.tokens)).toBeUndefined()

        // prefix test
        const r0 = { ...row, model: "aab" }
        const r1 = { ...r0, tokens: [...r0.tokens, tok0]}
        const r2 = { ...r0, tokens: [...r0.tokens, tok0, tok1]}
        expect(await cache.getBestMatch("aab", r2.tokens)).toBeUndefined()
        await cache.add(r0)
        expect(await cache.getBestMatch("aab", r2.tokens)).toEqual(r0)
        await cache.add(r1)
        expect(await cache.getBestMatch("aab", r2.tokens)).toEqual(r1)
        await cache.add(r2)
        expect(await cache.getBestMatch("aab", r2.tokens)).toEqual(r2)
      }
    ).beforeEach(clearDb)
  )
})
