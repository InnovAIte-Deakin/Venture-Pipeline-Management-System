import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const DataRoomFiles: CollectionConfig = {
  slug: 'dataRoomFiles',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
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
