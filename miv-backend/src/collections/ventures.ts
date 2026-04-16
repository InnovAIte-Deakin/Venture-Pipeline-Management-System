import type { CollectionConfig } from 'payload'
import { canReadInternalFields, isAdmin, isLoggedIn } from '@/access/roleAccess'

export const Ventures: CollectionConfig = {
  slug: 'ventures',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isLoggedIn,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Venture Name (EN)',
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'sector',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'founders',
      type: 'array',
      label: 'Founders',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'triageTrack',
      type: 'select',
      options: [
        { label: 'Unassigned', value: 'unassigned' },
        { label: 'Fast', value: 'fast' },
        { label: 'Slow', value: 'slow' },
      ],
      defaultValue: 'unassigned',
      access: {
        read: canReadInternalFields,
        update: isAdmin,
      },
    },
    {
      name: 'triageRationale',
      type: 'textarea',
      access: {
        read: canReadInternalFields,
        update: isAdmin,
      },
    },
    {
      name: 'internalReviewNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for admin / analyst review only',
      },
      access: {
        read: canReadInternalFields,
        update: isAdmin,
      },
    },
    {
      name: 'analystAssessment',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Promising', value: 'promising' },
        { label: 'Needs review', value: 'needs_review' },
        { label: 'Not suitable yet', value: 'not_suitable_yet' },
      ],
      defaultValue: 'pending',
      access: {
        read: canReadInternalFields,
        update: isAdmin,
      },
    },
    {
      name: 'reviewStatus',
      type: 'select',
      options: [
        { label: 'Not started', value: 'not_started' },
        { label: 'In review', value: 'in_review' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'not_started',
      access: {
        read: canReadInternalFields,
        update: isAdmin,
      },
    },
  ],
}