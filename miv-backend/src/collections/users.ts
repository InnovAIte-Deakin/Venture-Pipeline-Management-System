import { anyone } from '@/access/anyone'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  // 🔐 Admin panel access control (THIS is the correct place)
  access: {
    admin: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'miv_analyst',

    create: anyone,

    read: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'miv_analyst',

    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'miv_analyst',

    delete: ({ req }) =>
      req.user?.role === 'admin',
  },

  admin: {
    defaultColumns: ['email', 'first_name', 'last_name', 'role'],
    useAsTitle: 'email',
  },

  auth: true,

  fields: [
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'Founder', value: 'founder' },
        { label: 'MIV Analyst', value: 'miv_analyst' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'founder',
      required: true,
    },
  ],
}
