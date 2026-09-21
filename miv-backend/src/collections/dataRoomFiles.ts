import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { isAuthenticated, adminOnly, adminOrAnalyst } from '@/access/roles'
import { founderVentureScopedRead } from '@/access/scoping'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const DataRoomFiles: CollectionConfig = {
  slug: 'dataRoomFiles',
  access: {
    // Financial/registration PDFs — founder sees only their venture's (matrix §2 / A4).
    read: founderVentureScopedRead('venture'),
    create: isAuthenticated,
    // Was any-authenticated (A5) — now staff only.
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../uploads/dataroom'),
    mimeTypes: ['application/pdf'],
  },
  fields: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Pitch', value: 'pitch' },
        { label: 'Financials', value: 'financials' },
        { label: 'Policies', value: 'policies' },
        { label: 'Registration', value: 'registration' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'notes', type: 'text' },
  ],
}
