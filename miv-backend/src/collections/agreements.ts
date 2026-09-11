import type { CollectionConfig } from 'payload'
import { isAuthenticated, adminOnly, adminOrAnalyst } from '@/access/roles'
import { founderVentureScopedRead, fieldAdminOrAnalyst } from '@/access/scoping'

export const Agreements: CollectionConfig = {
  slug: 'agreements',
  admin: { useAsTitle: 'type' },
  access: {
    // Founder sees only their venture's agreements; staff see all (matrix §2 / A4).
    read: founderVentureScopedRead('venture'),
    create: isAuthenticated,
    // Was any-authenticated (A5) — any user could flip NDA/MOU status to signed/verified.
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'NDA', value: 'NDA' },
        { label: 'MOU', value: 'MOU' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not_requested',
      // NDA/MOU state is staff/provider-controlled. Lock it at create AND update so a
      // founder can't POST an agreement pre-set to "signed"/"verified" (review finding #3).
      // Intake creates stubs at 'not_requested' via overrideAccess, so onboarding is fine.
      access: {
        create: fieldAdminOrAnalyst,
        update: fieldAdminOrAnalyst,
      },
      options: [
        { label: 'Not Requested', value: 'not_requested' },
        { label: 'Requested', value: 'requested' },
        { label: 'Sent', value: 'sent' },
        { label: 'Signed', value: 'signed' },
        { label: 'Verified', value: 'verified' },
      ],
    },
    { name: 'provider', type: 'text' },
    { name: 'providerRequestId', type: 'text' },
    { name: 'providerEnvelopeId', type: 'text' },
  ],
}
