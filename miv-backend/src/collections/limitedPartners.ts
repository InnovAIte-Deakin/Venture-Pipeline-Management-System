import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const LimitedPartners: CollectionConfig = {
  slug: 'limitedPartners',
  admin: {
    defaultColumns: ['name', 'type', 'commitment', 'country', 'status', 'fund'],
    useAsTitle: 'name',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'commitment', type: 'number', required: true },
    { name: 'called', type: 'number', defaultValue: 0 },
    { name: 'distributed', type: 'number', defaultValue: 0 },
    { name: 'nav', type: 'number', defaultValue: 0 },
    { name: 'irr', type: 'number' },
    { name: 'tvpi', type: 'number' },
    { name: 'dpi', type: 'number' },
    { name: 'country', type: 'text', required: true },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'contactPerson', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'status', type: 'text', defaultValue: 'active' },
    { name: 'investmentDate', type: 'date' },
    { name: 'lastCapitalCall', type: 'date' },
    { name: 'lastDistribution', type: 'date' },
    { name: 'riskRating', type: 'text', defaultValue: 'medium' },
    { name: 'kycStatus', type: 'text', defaultValue: 'pending' },
    { name: 'accredited', type: 'checkbox', defaultValue: false },
    { name: 'fund', type: 'relationship', relationTo: 'funds', required: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
