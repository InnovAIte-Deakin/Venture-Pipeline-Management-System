// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'
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
    let founderId: string | undefined
    const founders = await payload.find({
      collection: 'users',
      where: { email: { equals: 'founder@example.com' } },
      limit: 1,
    })
    if (founders.totalDocs === 0) {
      const createdFounder = await payload.create({
        collection: 'users',
        data: {
          email: 'founder@example.com',
          password: 'changeme123',
          first_name: 'Founder',
          last_name: 'user',
          role: 'founder',
        },
      })
      founderId = createdFounder.id
      console.log('Seeded default founder user founder@example.com / changeme123')
    } else {
      founderId = founders.docs[0].id
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

    // Ensure sample documents exist for the founder (first-run only, idempotent per file)
    if (founderId) {
      const sampleDocs: Array<{
        fileName: string
        documentType: 'pitch_deck' | 'financial_statements' | 'legal_documents' | 'gedsi_reports'
        status: 'pending_review' | 'approved' | 'rejected' | 'needs_revision'
        notes: string
      }> = [
        {
          fileName: 'seed-pitch-deck-approved.pdf',
          documentType: 'pitch_deck',
          status: 'approved',
          notes: 'Sample pitch deck (seed data) — approved.',
        },
        {
          fileName: 'seed-financials-pending.pdf',
          documentType: 'financial_statements',
          status: 'pending_review',
          notes: 'Sample financial statements (seed data) — awaiting review.',
        },
        {
          fileName: 'seed-legal-rejected.pdf',
          documentType: 'legal_documents',
          status: 'rejected',
          notes: 'Sample legal document (seed data) — rejected, needs correction.',
        },
        {
          fileName: 'seed-gedsi-needs-revision.pdf',
          documentType: 'gedsi_reports',
          status: 'needs_revision',
          notes: 'Sample GEDSI report (seed data) — needs revision.',
        },
      ]

      // Minimal valid PDF, generated on the fly so no binary sample files need to live in the repo
      const minimalPdf = Buffer.from(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Size 4/Root 1 0 R>>\n%%EOF',
        'utf-8'
      )

      for (const doc of sampleDocs) {
        const existing = await payload.find({
          collection: 'documents',
          where: {
            and: [
              { filename: { equals: doc.fileName } },
              { uploadedBy: { equals: founderId } },
            ],
          },
          limit: 1,
        })
        if (existing.totalDocs === 0) {
          const tmpPath = path.join(os.tmpdir(), doc.fileName)
          await fs.writeFile(tmpPath, minimalPdf)
          await payload.create({
            collection: 'documents',
            filePath: tmpPath,
            data: {
              documentType: doc.documentType,
              status: doc.status,
              uploadedBy: founderId,
              notes: doc.notes,
            },
          })
          await fs.unlink(tmpPath).catch(() => {})
          console.log(`Seeded sample document: ${doc.fileName} (${doc.status})`)
        }
      }
    }
  },
})