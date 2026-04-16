import type { CollectionConfig } from 'payload'
import { afterIntakeCreate, setDisabilityFlag } from '@/hooks/intakes'
import { canReadInternalFields, isAdmin, isAnalystOrAdmin, isLoggedIn } from '@/access/roleAccess'

const wssOptions: { label: string; value: string }[] = [
  { label: 'No difficulty', value: 'no_difficulty' },
  { label: 'Some difficulty', value: 'some_difficulty' },
  { label: 'A lot of difficulty', value: 'a_lot_of_difficulty' },
  { label: 'Cannot do at all', value: 'cannot_do_at_all' },
] as const

export const OnboardingIntakes: CollectionConfig = {
  slug: 'onboardingIntakes',
  access: {
    read: isLoggedIn,
    create: () => true,
    update: isAnalystOrAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: false,
  },
  hooks: {
    beforeChange: [setDisabilityFlag],
    afterChange: [afterIntakeCreate],
  },
  fields: [
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: 'venture',
      type: 'relationship',
      relationTo: 'ventures' as any,
    },
    {
      name: 'wss',
      type: 'group',
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
      access: {
        read: canReadInternalFields,
        update: isAnalystOrAdmin,
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
    {
      name: 'assessmentSummary',
      type: 'textarea',
      admin: {
        description: 'Internal summary prepared by analyst/admin',
      },
      access: {
        read: canReadInternalFields,
        update: isAnalystOrAdmin,
      },
    },
    {
      name: 'recommendedNextStep',
      type: 'select',
      options: [
        { label: 'Needs more information', value: 'needs_more_information' },
        { label: 'Proceed to review', value: 'proceed_to_review' },
        { label: 'Hold', value: 'hold' },
      ],
      defaultValue: 'needs_more_information',
      access: {
        read: canReadInternalFields,
        update: isAnalystOrAdmin,
      },
    },
    {
      name: 'triageNotes',
      type: 'textarea',
      access: {
        read: canReadInternalFields,
        update: isAnalystOrAdmin,
      },
    },
  ],
}
// end