import type { GlobalConfig } from 'payload'

export const Lookups: GlobalConfig = {
  slug: 'lookups',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    { name: 'sectors', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
    {
      name: 'impactAreas',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'countries',
      type: 'array',
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
      ],
    },
    {
      name: 'currencies',
      type: 'array',
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
      ],
    },
  ],
}
