import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    // Allow admin UI to build the Create form
    create: () => true,

    read: (args) => {
      const { req, doc } = args as any
      if (!req.user) return false

      const role = req.user.role

      // Admin + MIV analyst can see all uploads
      if (role === 'admin' || role === 'miv_analyst') return true

      // Others can only see their own uploads
      return doc?.uploader?.id === req.user.id
    },

    // Only admin or MIV analyst can update
    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'miv_analyst',

    // Only admin or MIV analyst can delete
    delete: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'miv_analyst',
  },

  fields: [
    {
      name: 'uploader',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Auto-set uploader
        if (req.user) {
          data.uploader = req.user.id
        }
        return data
      },
    ],
  },

  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'square', width: 500, height: 500 },
      { name: 'small', width: 600 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
      { name: 'xlarge', width: 1920 },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
  },
}
