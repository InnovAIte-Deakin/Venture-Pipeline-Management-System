// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'


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
    url: process.env.MONGODB_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  onInit: async (payload) => {
    // Read seed credentials from environment variables.
    // In production these MUST be set — the app will refuse to start without them.
    // In development, if they are unset we skip seeding and log a warning instead.
    const seedAdminEmail = process.env.SEED_ADMIN_EMAIL
    const seedPassword = process.env.SEED_ADMIN_PASSWORD

    if (!seedAdminEmail || !seedPassword) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '[payload] SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in production. ' +
          'Add them to your Vercel environment variables or .env file.'
        )
      }
      console.warn(
        '[payload] SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD not set — ' +
        'skipping default user seeding in development. ' +
        'Copy .env.example to .env.local and fill in the seed vars to enable seeding.'
      )
      return
    }

    // Derive role-specific emails using optional overrides or + aliases
    const seedFounderEmail = process.env.SEED_FOUNDER_EMAIL || seedAdminEmail.replace('@', '+founder@')
    const seedAnalystEmail = process.env.SEED_ANALYST_EMAIL || seedAdminEmail.replace('@', '+analyst@')

    // Ensure a default admin exists (first-run only)
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: seedAdminEmail } },
      limit: 1,
    })
    if (users.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: seedAdminEmail,
          password: seedPassword,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
        },
      })
      console.log(`[payload] Seeded default admin user: ${seedAdminEmail}`)
    }

    // Ensure a default founder exists (first-run only)
    const founders = await payload.find({
      collection: 'users',
      where: { email: { equals: seedFounderEmail } },
      limit: 1,
    })
    if (founders.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: seedFounderEmail,
          password: seedPassword,
          first_name: 'Founder',
          last_name: 'User',
          role: 'founder',
        },
      })
      console.log(`[payload] Seeded default founder user: ${seedFounderEmail}`)
    }

    // Ensure a default analyst exists (first-run only)
    const analysts = await payload.find({
      collection: 'users',
      where: { email: { equals: seedAnalystEmail } },
      limit: 1,
    })
    if (analysts.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: seedAnalystEmail,
          password: seedPassword,
          first_name: 'Analyst',
          last_name: 'User',
          role: 'miv_analyst',
        },
      })
      console.log(`[payload] Seeded default analyst user: ${seedAnalystEmail}`)
    }
  },
})
