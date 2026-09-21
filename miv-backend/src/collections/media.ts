import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { isAuthenticated, adminOrAnalyst } from '@/access/roles'
import { ownerScoped } from '@/access/scoping'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    // Only logged-in users can upload
    create: isAuthenticated,

    // Fixed (matrix A9): the previous rule read `args.doc`, which Payload 3.x does not
    // pass to `read`, so String(undefined) !== userId denied founders ALL media, incl.
    // their own. Now returns a Where scoped to the uploader — staff still see everything.
    read: ownerScoped('uploader'),

    update: adminOrAnalyst,
    delete: adminOrAnalyst,
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
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          return { ...data, uploader: req.user.id }
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
