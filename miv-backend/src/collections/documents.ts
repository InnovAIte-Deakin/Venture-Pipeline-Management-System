import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticated } from '../access/authenticated'

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
    defaultColumns: ['filename', 'documentType', 'status', 'uploadedBy', 'createdAt'],
    useAsTitle: 'filename',
  },

  fields: [
    {
      name: 'documentType',
      label: 'Document Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Pitch Deck', value: 'pitch_deck' },
        { label: 'Financial Statements', value: 'financial_statements' },
        { label: 'Legal Documents', value: 'legal_documents' },
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
    {
      name: 'reviewedBy',
      label: 'Reviewed By',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewedAt',
      label: 'Reviewed At',
      type: 'date',
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
