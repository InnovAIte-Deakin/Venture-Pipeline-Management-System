import { anyone } from '@/access/anyone'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  // 🛠️ ADMIN UI SETTINGS
  admin: {
    defaultColumns: ['email', 'first_name', 'last_name', 'role'],
    useAsTitle: 'email',
    // This keeps the "Users" collection visible in the sidebar for Founders
    // but you can use logic here if you wanted to hide the tab entirely.
    // For a comparison demo, it's better to keep it visible but empty/filtered.
    group: 'Management', 
  },

  // 🔐 ACCESS CONTROL
  access: {
    // 🚪 The Gatekeeper: Allows Admin, Analyst, and Founder into the Dashboard UI.
    admin: ({ req }) => 
      ['admin', 'miv_analyst', 'founder'].includes(req.user?.role || ''),

    // Anyone can register (e.g., via a frontend signup page)
    create: anyone,

    // 👀 READ PROTECTION
    // Admins/Analysts see everyone. Founders see ONLY themselves.
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { id: { equals: user.id } }
    },

    // 📝 UPDATE PROTECTION
    // Admins/Analysts can edit anyone. Founders can only edit their own profile.
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'miv_analyst') return true
      return { id: { equals: user.id } }
    },

    // 🧨 DELETE PROTECTION
    // Strictly God Mode: Only Admins can delete accounts.
    delete: ({ req }) => req.user?.role === 'admin',
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
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'founder',
      required: true,
      // 🔐 FIELD-LEVEL PROTECTION
      // Prevents a Founder from using the API to promote themselves to Admin.
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}