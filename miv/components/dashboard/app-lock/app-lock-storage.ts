export const APP_LOCK_STORAGE_KEY = "vpms.mobile-app-lock.v1"

const APP_LOCK_VERSION = 1
const PIN_LENGTH = 4
const PBKDF2_ITERATIONS = 120_000

export interface AppLockRecord {
  version: typeof APP_LOCK_VERSION
  salt: string
  verifier: string
}

export function isValidAppLockPin(pin: string) {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin)
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToBytes(value: string) {
  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function deriveVerifier(pin: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
    },
    key,
    256,
  )

  return bytesToBase64(new Uint8Array(bits))
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false

  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

export async function createAppLockRecord(pin: string): Promise<AppLockRecord> {
  if (!isValidAppLockPin(pin)) {
    throw new Error("The app PIN must contain exactly four digits.")
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  return {
    version: APP_LOCK_VERSION,
    salt: bytesToBase64(salt),
    verifier: await deriveVerifier(pin, salt),
  }
}

export async function verifyAppLockPin(pin: string, record: AppLockRecord) {
  if (!isValidAppLockPin(pin)) return false
  const candidate = await deriveVerifier(pin, base64ToBytes(record.salt))
  return safeEqual(candidate, record.verifier)
}

export function parseAppLockRecord(value: string | null): AppLockRecord | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as Partial<AppLockRecord>
    if (
      parsed.version !== APP_LOCK_VERSION ||
      typeof parsed.salt !== "string" ||
      typeof parsed.verifier !== "string" ||
      !parsed.salt ||
      !parsed.verifier
    ) {
      return null
    }
    return parsed as AppLockRecord
  } catch {
    return null
  }
}

export function readAppLockRecord(storage: Pick<Storage, "getItem">) {
  try {
    return parseAppLockRecord(storage.getItem(APP_LOCK_STORAGE_KEY))
  } catch {
    return null
  }
}

export function saveAppLockRecord(
  storage: Pick<Storage, "setItem">,
  record: AppLockRecord,
) {
  storage.setItem(APP_LOCK_STORAGE_KEY, JSON.stringify(record))
}

export function clearAppLockRecord(storage: Pick<Storage, "removeItem">) {
  storage.removeItem(APP_LOCK_STORAGE_KEY)
}
