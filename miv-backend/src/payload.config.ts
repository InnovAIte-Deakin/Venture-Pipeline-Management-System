// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

console.log("🧪 DB URI at startup:", process.env.DATABASE_URI);

import { Users } from './collections/users'
import { Media } from './collections/media'
import { Ventures } from './collections/ventures'
import { OnboardingIntakes } from './collections/onboardingIntakes'
import { Agreements } from './collections/agreements'
import { Founders } from './collections/founders'
import { DataRoomFiles } from './collections/dataRoomFiles'
import { ActivityLogs } from './collections/activityLogs'
import { Documents } from './collections/documents'
import { Settings } from './globals/settings'
import { Lookups } from './globals/lookups'
import { SystemSettings } from './collections/systemsettings'
import { UserSettings } from './collections/userSettings'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: ['en', 'km'],
    defaultLocale: 'en',
  },
  collections: [
    Users,
    Media,
    Ventures,
    OnboardingIntakes,
    Founders,
    Agreements,
    DataRoomFiles,
    ActivityLogs,
    Documents,
    SystemSettings,
    UserSettings
  ],
  globals: [Settings, Lookups],
  // Explicit origins are required when sending credentials (cookies)
  cors: allowedOrigins,
  // Allow CSRF from the same set of origins when using cookies
  csrf: allowedOrigins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  onInit: async (payload) => {
    const adminEmail = process.env.SEED_ADMIN_EMAIL
    const adminPassword = process.env.SEED_ADMIN_PASSWORD
    const founderEmail = process.env.SEED_FOUNDER_EMAIL
    const founderPassword = process.env.SEED_FOUNDER_PASSWORD
    const analystEmail = process.env.SEED_ANALYST_EMAIL
    const analystPassword = process.env.SEED_ANALYST_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.warn('SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD not set — skipping admin seed')
    } else {
      const users = await payload.find({
        collection: 'users',
        where: { email: { equals: adminEmail } },
        limit: 1,
      })
      if (users.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: { email: adminEmail, password: adminPassword, first_name: 'Admin', last_name: 'User', role: 'admin' },
        })
        console.log(`Seeded default admin user: ${adminEmail}`)
      }
    }

    if (!founderEmail || !founderPassword) {
      console.warn('SEED_FOUNDER_EMAIL or SEED_FOUNDER_PASSWORD not set — skipping founder seed')
    } else {
      const founders = await payload.find({
        collection: 'users',
        where: { email: { equals: founderEmail } },
        limit: 1,
      })
      if (founders.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: { email: founderEmail, password: founderPassword, first_name: 'Founder', last_name: 'User', role: 'founder' },
        })
        console.log(`Seeded default founder user: ${founderEmail}`)
      }
    }

    if (!analystEmail || !analystPassword) {
      console.warn('SEED_ANALYST_EMAIL or SEED_ANALYST_PASSWORD not set — skipping analyst seed')
    } else {
      const analysts = await payload.find({
        collection: 'users',
        where: { email: { equals: analystEmail } },
        limit: 1,
      })
      if (analysts.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: { email: analystEmail, password: analystPassword, first_name: 'Analyst', last_name: 'User', role: 'miv_analyst' },
        })
        console.log(`Seeded default analyst user: ${analystEmail}`)
      }
    }
  },
})
