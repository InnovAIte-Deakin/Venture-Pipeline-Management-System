// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

console.log('🧪 DB URI at startup:', process.env.DATABASE_URI)

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
import { GedsiMetrics } from './collections/gedsiMetrics'
import { IrisMetricCatalog } from './collections/irisMetricCatalog'
import { Notifications } from './collections/notifications'
import { EmailLogs } from './collections/emailLogs'
import { Projects } from './collections/projects'
import { Tasks } from './collections/tasks'
import { TeamEvents } from './collections/teamEvents'
import { Announcements } from './collections/announcements'
import { Workflows } from './collections/workflows'
import { WorkflowRuns } from './collections/workflowRuns'
import { CapitalActivities } from './collections/capitalActivities'
import { Funds } from './collections/funds'
import { LimitedPartners } from './collections/limitedPartners'
import { CapitalCalls } from './collections/capitalCalls'
import { Distributions } from './collections/distributions'
import { FundInvestments } from './collections/fundInvestments'
import { FundWorkflows } from './collections/fundWorkflows'
import { FundLifecyclePhases } from './collections/fundLifecyclePhases'
import { FundOperationTasks } from './collections/fundOperationTasks'
import { Reports } from './collections/reports'
import { CustomDashboards } from './collections/customDashboards'
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
    UserSettings,
    GedsiMetrics,
    IrisMetricCatalog,
    Notifications,
    EmailLogs,
    Projects,
    Tasks,
    TeamEvents,
    Announcements,
    Workflows,
    WorkflowRuns,
    CapitalActivities,
    Funds,
    LimitedPartners,
    CapitalCalls,
    Distributions,
    FundInvestments,
    FundWorkflows,
    FundLifecyclePhases,
    FundOperationTasks,
    Reports,
    CustomDashboards,
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

    // Ensure a default founder exists (first-run only)
    const founders = await payload.find({
      collection: 'users',
      where: { email: { equals: 'founder@example.com' } },
      limit: 1,
    })
    if (founders.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'founder@example.com',
          password: 'changeme123',
          first_name: 'Founder',
          last_name: 'user',
          role: 'founder',
        },
      })
      console.log('Seeded default founder user founder@example.com / changeme123')
    }

    // Ensure a default miv_analyst exists (first-run only)
    const analysts = await payload.find({
      collection: 'users',
      where: { email: { equals: 'analyst@example.com' } },
      limit: 1,
    })
    if (analysts.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'analyst@example.com',
          password: 'changeme123',
          first_name: 'Analyst',
          last_name: 'User',
          role: 'miv_analyst',
        },
      })
      console.log('Seeded default miv_analyst user analyst@example.com / changeme123')
    }
  },
})
