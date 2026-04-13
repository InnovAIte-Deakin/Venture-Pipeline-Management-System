import type { CollectionConfig, FieldAccess } from 'payload'

const analystOrAdminOnly: FieldAccess = ({ req }) => {
  return Boolean(req.user && (req.user.role === 'admin' || req.user.role === 'miv_analyst'))
}

export const Ventures: CollectionConfig = {
  slug: 'ventures',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Venture Name (EN)',
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'sector',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'founders',
      type: 'array',
      label: 'Founders',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'triageTrack',
      type: 'select',
      access: {
        read: analystOrAdminOnly,
        update: analystOrAdminOnly,
      },
      options: [
        { label: 'Unassigned', value: 'unassigned' },
        { label: 'Fast', value: 'fast' },
        { label: 'Slow', value: 'slow' },
      ],
      defaultValue: 'unassigned',
    },
    {
      name: 'triageRationale',
      type: 'textarea',
      access: {
        read: analystOrAdminOnly,
        update: analystOrAdminOnly,
      },
    },
  ],
}