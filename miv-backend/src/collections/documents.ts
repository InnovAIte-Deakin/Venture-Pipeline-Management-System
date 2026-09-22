import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticated } from '../access/authenticated'
import { fieldAdminOrAnalyst } from '@/access/scoping'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Documents: CollectionConfig = {
  slug: 'documents',

  access: {
    create: authenticated,

    read: ({ req }) => {
      if (!req.user) return false

      const role = req.user.role

      // MIV analysts and admins can see all documents
      if (role === 'miv_analyst' || role === 'admin') return true

      // Founders can only see their own documents
      return {
        uploadedBy: {
          equals: req.user.id,
        },
      }
    },

    update: ({ req }) => {
      if (!req.user) return false
      const role = req.user.role
      return role === 'miv_analyst' || role === 'admin'
    },

    delete: ({ req }) => {
      if (!req.user) return false
      const role = req.user.role
      return role === 'miv_analyst' || role === 'admin'
    },
  },

  admin: {
    defaultColumns: ['filename', 'name', 'documentType', 'status', 'uploadedBy', 'createdAt'],
    useAsTitle: 'filename',
  },

  fields: [
    {
      name: 'name',
      label: 'Legacy Document Name',
      type: 'text',
    },
    {
      name: 'documentType',
      label: 'Document Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Pitch Deck', value: 'pitch_deck' },
        { label: 'Financial Statements', value: 'financial_statements' },
        { label: 'Business Plan', value: 'business_plan' },
        { label: 'Legal Documents', value: 'legal_documents' },
        { label: 'Market Research', value: 'market_research' },
        { label: 'Team Profile', value: 'team_profile' },
        { label: 'GEDSI Reports', value: 'gedsi_reports' },
        { label: 'Impact Reports', value: 'impact_reports' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending_review',
      // Review workflow — only staff may set status (matrix §4). A founder must not
      // approve their own document, at create or update. The upload route sets the
      // safe default 'pending_review'; a founder-denied field just falls back to it.
      access: {
        create: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
      },
      options: [
        { label: 'Pending Review', value: 'pending_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Needs Revision', value: 'needs_revision' },
      ],
    },
    {
      name: 'version',
      label: 'Version',
      type: 'number',
      defaultValue: 1,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'uploadedBy',
      label: 'Uploaded By',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'venture',
      label: 'Venture',
      type: 'relationship',
      relationTo: 'ventures',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
    },
    { name: 'legacyUrl', type: 'text' },
    { name: 'legacySize', type: 'number' },
    { name: 'legacyMimeType', type: 'text' },
    { name: 'legacyUploadedAt', type: 'date' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'reviewedBy',
      label: 'Reviewed By',
      type: 'relationship',
      relationTo: 'users',
      access: {
        create: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewedAt',
      label: 'Reviewed At',
      type: 'date',
      access: {
        create: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        // Set uploadedBy on create
        if (operation === 'create' && req.user) {
          data.uploadedBy = req.user.id
        }
        return data
      },
    ],
  },

  upload: {
    staticDir: path.resolve(dirname, '../../uploads/documents'),
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  },
}
