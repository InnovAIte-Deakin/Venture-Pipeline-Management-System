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
import { Settings } from './globals/settings'
import { Lookups } from './globals/lookups'
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
    // Ensure a default admin exists (first-run only)
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@example.com' } },
      limit: 1,
    })
    if (users.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'changeme123',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
        },
      })
      console.log('Seeded default admin user admin@example.com / changeme123')
    }
  },
})
