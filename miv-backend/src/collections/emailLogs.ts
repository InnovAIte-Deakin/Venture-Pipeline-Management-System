import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const EmailLogs: CollectionConfig = {
  slug: 'emailLogs',
  admin: {
    defaultColumns: ['to', 'subject', 'template', 'status', 'sentAt'],
    useAsTitle: 'subject',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'to', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'template', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: 'Bounced', value: 'bounced' },
      ],
    },
    { name: 'sentAt', type: 'date' },
    { name: 'errorMessage', type: 'textarea' },
    { name: 'metadata', type: 'json' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
