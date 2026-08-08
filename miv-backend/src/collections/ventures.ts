import type { CollectionConfig } from 'payload'
import { isAuthenticated, adminOnly } from '@/access/roles'
import { founderOwnVenturesRead, fieldAdminOrAnalyst } from '@/access/scoping'

export const Ventures: CollectionConfig = {
  slug: 'ventures',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // Founders see only their own venture(s); staff see all (matrix §2 / A4).
    read: founderOwnVenturesRead,
    // Was fully public — now requires auth (matrix A3). Confirm intake flow at review.
    create: isAuthenticated,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Venture Name (EN)' },
    { name: 'country', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'sector', type: 'text', required: true },
    { name: 'website', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'founders',
      type: 'array',
      label: 'Founders',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'fullName', type: 'text', required: true },
      ],
    },
    {
      name: 'triageTrack',
      type: 'select',
      // Internal staff assessment — hidden from founders (matrix §4).
      access: {
        read: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
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
        read: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
      },
    },
  ],
}
