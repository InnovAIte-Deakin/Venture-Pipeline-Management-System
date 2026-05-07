import type { CollectionConfig } from 'payload'

export const OnboardingIntakes: CollectionConfig = {
  slug: 'onboardingIntakes',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'submittedByEmail': { equals: user.email } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { 'submittedByEmail': { equals: user.email } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any, required: true },
    { name: 'submittedByEmail', type: 'email', required: true, defaultValue: ({ user }) => user?.email },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Approved', value: 'approved' },
      ],
      access: {
        update: ({ req }) => req.user?.role !== 'founder',
      }
    },
  ],
}