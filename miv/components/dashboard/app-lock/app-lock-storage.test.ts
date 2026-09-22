import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  createAppLockRecord,
  isValidAppLockPin,
  parseAppLockRecord,
  verifyAppLockPin,
} from "./app-lock-storage"

describe("mobile app lock storage", () => {
  it("accepts only a four-digit PIN", () => {
    assert.equal(isValidAppLockPin("1357"), true)
    assert.equal(isValidAppLockPin("135"), false)
    assert.equal(isValidAppLockPin("13579"), false)
    assert.equal(isValidAppLockPin("13a7"), false)
  })

  it("creates a salted verifier without storing the PIN", async () => {
    const record = await createAppLockRecord("2468")

    assert.equal(record.version, 1)
    assert.ok(record.salt)
    assert.ok(record.verifier)
    assert.equal(JSON.stringify(record).includes("2468"), false)
  })

  it("verifies the correct PIN and rejects an incorrect PIN", async () => {
    const record = await createAppLockRecord("8642")

    assert.equal(await verifyAppLockPin("8642", record), true)
    assert.equal(await verifyAppLockPin("0000", record), false)
  })

  it("rejects malformed stored records", () => {
    assert.equal(parseAppLockRecord(null), null)
    assert.equal(parseAppLockRecord("not-json"), null)
    assert.equal(parseAppLockRecord('{"version":1,"salt":""}'), null)
  })
})
