import "fake-indexeddb/auto"
import { assert, expect, test } from 'vitest'
import * as cache from "../src/lib/cache"

test('has indexedDB', () => {
  indexedDB
})
