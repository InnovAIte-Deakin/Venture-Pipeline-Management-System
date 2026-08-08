import type { CollectionConfig } from 'payload'
import { afterIntakeCreate, setDisabilityFlag } from '@/hooks/intakes'
import { adminOnly, adminOrAnalyst } from '@/access/roles'
import { founderVentureScopedRead, fieldAdminOnly } from '@/access/scoping'

const wssOptions: { label: string; value: string }[] = [
  { label: 'No difficulty', value: 'no_difficulty' },
  { label: 'Some difficulty', value: 'some_difficulty' },
  { label: 'A lot of difficulty', value: 'a_lot_of_difficulty' },
  { label: 'Cannot do at all', value: 'cannot_do_at_all' },
] as const

export const OnboardingIntakes: CollectionConfig = {
  slug: 'onboardingIntakes',
  access: {
    // Founder sees only their venture's intake; staff see all (matrix §2 / A4).
    read: founderVentureScopedRead('venture'),
    // Public intake form — create stays open by design.
    create: () => true,
    // Was `role !== 'founder'` — allowed the legacy `user` role on disability data. Staff-only now.
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  versions: { drafts: false },
  hooks: {
    beforeChange: [setDisabilityFlag],
    afterChange: [afterIntakeCreate],
  },
  fields: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    {
      name: 'wss',
      type: 'group',
      // Washington Short Set — disability data. Tightest control: admin-only read/write
      // (matrix §4). Staff-analyst read can be widened at review if GEDSI needs it.
      access: {
        read: fieldAdminOnly,
        update: fieldAdminOnly,
      },
      fields: [
        { name: 'seeing', type: 'select', required: true, options: wssOptions },
        { name: 'hearing', type: 'select', required: true, options: wssOptions },
        { name: 'walking', type: 'select', required: true, options: wssOptions },
        { name: 'cognition', type: 'select', required: true, options: wssOptions },
        { name: 'selfCare', type: 'select', required: true, options: wssOptions },
        { name: 'communication', type: 'select', required: true, options: wssOptions },
      ],
    },
    {
      name: 'disabilityFlag',
      type: 'checkbox',
      defaultValue: false,
      // Derived from WSS by a hook — never founder-writable (matrix §4).
      access: {
        read: fieldAdminOnly,
        update: fieldAdminOnly,
      },
    },
    {
      name: 'impactAreas',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Agriculture', value: 'agri' },
        { label: 'Gender', value: 'gender' },
        { label: 'Climate', value: 'climate' },
      ],
    },
    {
      name: 'founders',
      type: 'array',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'financials',
      type: 'group',
      fields: [
        { name: 'currency', type: 'text' },
        { name: 'lastFYRevenue', type: 'number' },
        { name: 'avgMonthlyRevenue', type: 'number' },
        { name: 'currentCashBalance', type: 'number' },
        { name: 'stage', type: 'text' },
        { name: 'notes', type: 'text' },
      ],
    },
    {
      name: 'gedsi',
      type: 'group',
      fields: [
        { name: 'hasPolicy', type: 'checkbox' },
        { name: 'notes', type: 'textarea' },
      ],
    },
  ],
}

// end
