import type { CollectionConfig } from 'payload'

export const Founders: CollectionConfig = {
  slug: 'founders',
  admin: { useAsTitle: 'fullName' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user && req.user.role !== 'founder'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    { name: 'user', type: 'relationship', relationTo: 'users' },
  ],
}
