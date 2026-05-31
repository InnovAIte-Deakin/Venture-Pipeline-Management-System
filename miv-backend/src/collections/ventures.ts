import type { CollectionConfig } from 'payload'

export const Ventures: CollectionConfig = {
  slug: 'ventures',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
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
      maxRows: 2,
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
      options: [
        { label: 'Unassigned', value: 'unassigned' },
        { label: 'Fast', value: 'fast' },
        { label: 'Slow', value: 'slow' },
      ],
      defaultValue: 'unassigned',
    },
    { name: 'triageRationale', type: 'textarea' },
  ],

  endpoints: [
    {
      path: '/light',
      method: 'get',
      handler: async (req) => {
        const limit = Number(req.query.limit) || 5
        const page = Number(req.query.page) || 1
        const sector = req.query.sector as string | undefined
        const city = req.query.city as string | undefined

        const where: any = {}

        if (sector) {
          where.sector = { equals: sector }
        }

        if (city) {
          where.city = { equals: city }
        }

        const data = await req.payload.find({
          collection: 'ventures',
          limit,
          page,
          depth: 0,
          where,
          select: {
            name: true,
            country: true,
            city: true,
            sector: true,
          },
        })

        return Response.json(data)
      },
    },
  ],
}