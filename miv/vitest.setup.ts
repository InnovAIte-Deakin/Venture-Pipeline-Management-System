import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const setupDirectory = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(setupDirectory, '.env.test')

if (existsSync(envPath)) {
  config({ path: envPath, override: true })
}