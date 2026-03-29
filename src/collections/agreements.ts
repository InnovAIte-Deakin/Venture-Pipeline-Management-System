import type { CollectionConfig } from 'payload'

export const Agreements: CollectionConfig = {
  slug: 'agreements',
  admin: { useAsTitle: 'type' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'NDA', value: 'NDA' },
        { label: 'MOU', value: 'MOU' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not_requested',
      options: [
        { label: 'Not Requested', value: 'not_requested' },
        { label: 'Requested', value: 'requested' },
        { label: 'Sent', value: 'sent' },
        { label: 'Signed', value: 'signed' },
        { label: 'Verified', value: 'verified' },
      ],
    },
    { name: 'provider', type: 'text' },
    { name: 'providerRequestId', type: 'text' },
    { name: 'providerEnvelopeId', type: 'text' },
  ],
}
