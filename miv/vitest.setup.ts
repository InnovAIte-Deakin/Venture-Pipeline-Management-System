import { existsSync } from 'node:fs'
import { config } from 'dotenv'

if (!existsSync('.env.test')) {
  throw new Error(
    '.env.test is missing. Copy .env.test.example and point it at a throwaway database.'
  )
}

config({ path: '.env.test', override: true })