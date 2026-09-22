import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'

export const TeamEvents: CollectionConfig = {
  slug: 'teamEvents',
  admin: {
    defaultColumns: ['title', 'date', 'time', 'location', 'organizer'],
    useAsTitle: 'title',
  },
  access: {
    read: isAuthenticated,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'date', type: 'date', required: true },
    { name: 'time', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'isAllDay', type: 'checkbox', defaultValue: false },
    { name: 'isRecurring', type: 'checkbox', defaultValue: false },
    { name: 'recurrence', type: 'json' },
    { name: 'organizer', type: 'relationship', relationTo: 'users', required: true },
    { name: 'attendees', type: 'relationship', relationTo: 'users', hasMany: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
