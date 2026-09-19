import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'
import { founderVentureScopedRead } from '@/access/scoping'

export const GedsiMetrics: CollectionConfig = {
  slug: 'gedsiMetrics',
  admin: {
    defaultColumns: ['metricCode', 'metricName', 'category', 'status', 'venture'],
    useAsTitle: 'metricName',
  },
  access: {
    read: founderVentureScopedRead('venture'),
    create: isAuthenticated,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'venture', type: 'relationship', relationTo: 'ventures', required: true },
    { name: 'metricCode', type: 'text', required: true },
    { name: 'metricName', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Gender', value: 'gender' },
        { label: 'Disability', value: 'disability' },
        { label: 'Social Inclusion', value: 'social_inclusion' },
        { label: 'Cross Cutting', value: 'cross_cutting' },
      ],
    },
    { name: 'targetValue', type: 'number', required: true },
    { name: 'currentValue', type: 'number', required: true },
    { name: 'unit', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'not_started',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Verified', value: 'verified' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'verificationDate', type: 'date' },
    { name: 'notes', type: 'textarea' },
    { name: 'createdBy', type: 'relationship', relationTo: 'users' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
