import type { CollectionConfig } from 'payload'
import { adminOnly, isAuthenticated } from '@/access/roles'
import { ownerScoped } from '@/access/scoping'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    defaultColumns: ['title', 'type', 'user', 'isRead', 'createdAt'],
    useAsTitle: 'title',
  },
  access: {
    read: ownerScoped('user'),
    create: isAuthenticated,
    update: ownerScoped('user'),
    delete: adminOnly,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Welcome', value: 'welcome' },
        { label: 'Venture Created', value: 'venture_created' },
        { label: 'Venture Updated', value: 'venture_updated' },
        { label: 'GEDSI Alert', value: 'gedsi_alert' },
        { label: 'Funding Opportunity', value: 'funding_opportunity' },
        { label: 'System Update', value: 'system_update' },
        { label: 'Report Ready', value: 'report_ready' },
        { label: 'STG Reminder', value: 'stg_reminder' },
        { label: 'Weekly Update', value: 'weekly_update' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'isRead', type: 'checkbox', defaultValue: false },
    { name: 'metadata', type: 'json' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
