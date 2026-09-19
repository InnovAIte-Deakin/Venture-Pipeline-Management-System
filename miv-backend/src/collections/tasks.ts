import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    defaultColumns: ['name', 'status', 'priority', 'project', 'assignedTo', 'dueDate'],
    useAsTitle: 'name',
  },
  access: {
    read: isAuthenticated,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'todo',
      options: [
        { label: 'Todo', value: 'todo' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Review', value: 'review' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    { name: 'dueDate', type: 'date' },
    { name: 'completedAt', type: 'date' },
    { name: 'estimatedHours', type: 'number' },
    { name: 'actualHours', type: 'number' },
    { name: 'tags', type: 'json' },
    { name: 'notes', type: 'textarea' },
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'createdBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'dependencies', type: 'relationship', relationTo: 'tasks', hasMany: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
