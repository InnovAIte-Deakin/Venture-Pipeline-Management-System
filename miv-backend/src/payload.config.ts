// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/users'
import { Media } from './collections/media'
import { Ventures } from './collections/ventures'
import { OnboardingIntakes } from './collections/onboardingIntakes'
import { Agreements } from './collections/agreements'
import { Founders } from './collections/founders'
import { DataRoomFiles } from './collections/dataRoomFiles'
import { ActivityLogs } from './collections/activityLogs'
import { Documents } from './collections/documents'
import { SystemSettings } from './collections/systemsettings'
import { UserSettings } from './collections/userSettings'

// Globals
import { Settings } from './globals/settings'
import { Lookups } from './globals/lookups'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log("🧪 DB URI at startup:", process.env.DATABASE_URI);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Optional: Auto-fill login for faster local dev testing
    autoLogin: {
      email: 'admin@example.com',
      password: 'changeme123',
      prefillOnly: true,
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
    // 🛡️ Hide Staff-Only management collections from Founders
    {
      ...Founders,
      admin: {
        ...Founders.admin,
        hidden: ({ user }) => user?.role === 'founder',
      },
    },
    {
      ...Agreements,
      admin: {
        ...Agreements.admin,
        hidden: ({ user }) => user?.role === 'founder',
      },
    },
    DataRoomFiles,
    // 🛡️ Hide Activity Logs from everyone except Admin/Analyst
    {
      ...ActivityLogs,
      admin: {
        ...ActivityLogs.admin,
        hidden: ({ user }) => user?.role === 'founder',
      },
    },
    Documents,
    // 🛡️ Hide System Settings from Founders
    {
      ...SystemSettings,
      admin: {
        ...SystemSettings.admin,
        hidden: ({ user }) => user?.role === 'founder',
      }
    },
    UserSettings
  ],
  globals: [
    // 🛡️ Hide Globals from Founders so they don't see system configuration
    {
      ...Settings,
      admin: {
        ...Settings.admin,
        hidden: ({ user }) => user?.role === 'founder',
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      }
    },
    {
      ...Lookups,
      admin: {
        ...Lookups.admin,
        hidden: ({ user }) => user?.role === 'founder',
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      }
    }
  ],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'f8b68b3e5316e663b938338f',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://mongo:27017/payload',
  }),
  sharp,
  plugins: [payloadCloudPlugin()],
  onInit: async (payload) => {
    // Helper to seed a user if they don't exist
    const seedUser = async (email, firstName, lastName, role) => {
      const result = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      })
      if (result.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email,
            password: 'changeme123',
            first_name: firstName,
            last_name: lastName,
            role,
          },
        })
        console.log(`✅ Seeded ${role}: ${email}`)
      }
    }

    // Seed our 3 core personas for Sprint 1 Testing
    await seedUser('admin@example.com', 'Admin', 'User', 'admin')
    await seedUser('founder@example.com', 'Founder', 'User', 'founder')
    await seedUser('analyst@example.com', 'Analyst', 'User', 'miv_analyst')
  },
})