import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'uploadedBy': { equals: user.id } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'uploadedBy': { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin' || { 'uploadedBy': { equals: user?.id } },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    { name: 'uploadedBy', type: 'relationship', relationTo: 'users', defaultValue: ({ user }) => user?.id },
  ],
}