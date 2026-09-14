import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const CapitalCalls: CollectionConfig = {
  slug: 'capitalCalls',
  admin: {
    defaultColumns: ['callNumber', 'amount', 'dueDate', 'status', 'fund'],
    useAsTitle: 'callNumber',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'callNumber', type: 'text', required: true },
    { name: 'amount', type: 'number', required: true },
    { name: 'dueDate', type: 'date', required: true },
    { name: 'status', type: 'text', defaultValue: 'pending' },
    { name: 'purpose', type: 'textarea', required: true },
    { name: 'investments', type: 'json' },
    { name: 'expenses', type: 'number' },
    { name: 'interestRate', type: 'number', defaultValue: 0 },
    { name: 'gracePeriod', type: 'number', defaultValue: 30 },
    { name: 'defaultPenalty', type: 'number', defaultValue: 0 },
    { name: 'wireInstructions', type: 'checkbox', defaultValue: false },
    { name: 'noticeDate', type: 'date' },
    { name: 'remindersSent', type: 'number', defaultValue: 0 },
    { name: 'documentsGenerated', type: 'checkbox', defaultValue: false },
    { name: 'lpsResponded', type: 'number', defaultValue: 0 },
    { name: 'totalLps', type: 'number', required: true },
    { name: 'fund', type: 'relationship', relationTo: 'funds', required: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
