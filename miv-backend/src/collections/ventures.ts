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
    { name: 'country', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'sector', type: 'text', required: true },
    { name: 'website', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'pitchSummary', type: 'textarea' },
    { name: 'inclusionFocus', type: 'text' },
    { name: 'founderTypes', type: 'text' },
    { name: 'teamSize', type: 'number' },
    { name: 'foundingYear', type: 'number' },
    { name: 'targetMarket', type: 'text' },
    { name: 'revenueModel', type: 'text' },
    { name: 'revenue', type: 'number' },
    { name: 'fundingRaised', type: 'number' },
    { name: 'lastValuation', type: 'number' },
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
      // Internal staff assessment — hidden from founders, and not settable by a
      // founder at create time either (matrix §4). Intake sets it via overrideAccess.
      access: {
        create: fieldAdminOrAnalyst,
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
        create: fieldAdminOrAnalyst,
        read: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'stage',
      type: 'select',
      options: [
        { label: 'Intake', value: 'intake' },
        { label: 'Screening', value: 'screening' },
        { label: 'Due Diligence', value: 'due_diligence' },
        { label: 'Investment Ready', value: 'investment_ready' },
        { label: 'Funded', value: 'funded' },
        { label: 'Exited', value: 'exited' },
        { label: 'Seed', value: 'seed' },
        { label: 'Series A', value: 'series_a' },
        { label: 'Series B', value: 'series_b' },
        { label: 'Series C', value: 'series_c' },
      ],
      defaultValue: 'intake',
    },
    { name: 'gedsiScore', type: 'number' },
    { name: 'socialImpactScore', type: 'number' },
    { name: 'gedsiComplianceRate', type: 'number' },
    { name: 'totalBeneficiaries', type: 'number' },
    { name: 'jobsCreated', type: 'number' },
    { name: 'womenEmpowered', type: 'number' },
    { name: 'disabilityInclusive', type: 'number' },
    { name: 'youthEngaged', type: 'number' },
    { name: 'calculatedAt', type: 'date' },
    { name: 'intakeDate', type: 'date' },
    { name: 'screeningDate', type: 'date' },
    { name: 'dueDiligenceStart', type: 'date' },
    { name: 'dueDiligenceEnd', type: 'date' },
    { name: 'investmentReadyAt', type: 'date' },
    { name: 'fundedAt', type: 'date' },
    { name: 'nextReviewAt', type: 'date' },
    { name: 'stgGoals', type: 'json' },
    { name: 'gedsiMetricsSummary', type: 'json' },
    { name: 'financials', type: 'json' },
    { name: 'documentsMetadata', type: 'json' },
    { name: 'tags', type: 'json' },
    { name: 'operationalReadiness', type: 'json' },
    { name: 'capitalReadiness', type: 'json' },
    { name: 'gedsiGoals', type: 'json' },
    { name: 'washingtonShortSet', type: 'json' },
    { name: 'disabilityInclusion', type: 'json' },
    { name: 'aiAnalysis', type: 'json' },
    { name: 'challenges', type: 'textarea' },
    { name: 'supportNeeded', type: 'textarea' },
    { name: 'timeline', type: 'text' },
    { name: 'createdBy', type: 'relationship', relationTo: 'users' },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
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