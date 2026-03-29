import type { CollectionConfig } from 'payload'

export const SystemSettings: CollectionConfig = {
  slug: 'system-settings',
  admin: {
    useAsTitle: 'appName',
    description: 'Global system settings (single record)',

  },
  hooks: {
  beforeChange: [
    async ({ req, operation }) => {
      if (operation === 'create') {
        const existing = await req.payload.find({
          collection: 'system-settings',
          limit: 1,
        })
        if (existing.totalDocs > 0) {
          throw new Error('System settings already exists. Only one record allowed.')
        }
      }
    },
  ],
},
  access: {
    // Any logged-in user can read settings
    read: ({ req }) => Boolean(req.user),

    // Only admin can create/update/delete
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
   
    {
      name: 'appName',
      type: 'text',
      required: true,
      defaultValue: 'VPMS',
    },
    {
      name: 'supportEmail',
      type: 'email',
      required: true,
      defaultValue: 'support@example.com',
    },
    {
      name: 'defaultLocale',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Khmer', value: 'km' },
      ],
      defaultValue: 'en',
      required: true,
    },
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'Australia/Melbourne',
      required: true,
    },

    // --- Security ---
    {
      name: 'enableSignup',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'sessionTimeoutMinutes',
      type: 'number',
      defaultValue: 60,
      required: true,
      min: 5,
      max: 1440,
    },

    // --- Uploads / Media ---
    {
      name: 'maxUploadMB',
      type: 'number',
      defaultValue: 10,
      required: true,
      min: 1,
      max: 200,
    },
    {
      name: 'allowedMimeTypes',
      type: 'array',
      fields: [
        {
          name: 'mime',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { mime: 'image/png' },
        { mime: 'image/jpeg' },
        { mime: 'application/pdf' },
      ],
    },

    // --- Feature toggles ---
    {
      name: 'features',
      type: 'group',
      fields: [
        {
          name: 'enableImpactDashboard',
          type: 'checkbox',
          defaultValue: true,
          required: true,
        },
        {
          name: 'enableGedsitracker',
          type: 'checkbox',
          defaultValue: true,
          required: true,
        },
        {
          name: 'enableDiagnostics',
          type: 'checkbox',
          defaultValue: true,
          required: true,
        },
      ],
    },
  ],
}
