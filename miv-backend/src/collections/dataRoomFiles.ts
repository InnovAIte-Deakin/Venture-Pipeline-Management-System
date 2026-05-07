import type { CollectionConfig } from 'payload'

export const DataRoomFiles: CollectionConfig = {
  slug: 'dataRoomFiles',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'ownerEmail': { equals: user.email } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'ownerEmail': { equals: user.email } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'category', type: 'select', options: [{ label: 'Pitch', value: 'pitch' }] },
    { name: 'ownerEmail', type: 'email', defaultValue: ({ user }) => user?.email },
  ],
}