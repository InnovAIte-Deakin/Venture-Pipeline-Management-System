import type { CollectionConfig } from 'payload'

export const Ventures: CollectionConfig = {
  slug: 'ventures',
  admin: { useAsTitle: 'name' },
  access: {
    // Admin/Analyst see all. Founders only see ventures where their email is in the founder list.
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'founders.email': { equals: user.email } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'founders.email': { equals: user.email } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'founders',
      type: 'array',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    { name: 'sector', type: 'text', required: true },
    { 
      name: 'internalNotes', 
      type: 'textarea',
      access: {
        read: ({ req }) => req.user?.role !== 'founder',
        update: ({ req }) => req.user?.role !== 'founder',
      }
    },
  ],
}