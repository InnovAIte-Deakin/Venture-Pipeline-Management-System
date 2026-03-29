/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'
// EmailJS service removed - intake notifications temporarily disabled

export const setDisabilityFlag: CollectionBeforeChangeHook = async ({ data }: any) => {
  if (data?.wss) {
    const difficult = Object.values(data.wss).some(
      (v: any) => v === 'a_lot_of_difficulty' || v === 'cannot_do_at_all',
    )
    return { ...data, disabilityFlag: difficult }
  }
  return data
}

export const afterIntakeCreate: CollectionAfterChangeHook = async ({ doc, operation, req }: any) => {
  if (operation !== 'create') return
  const payload = req.payload
  let ventureId = (doc as any).venture
  // If no venture linked, create one
  if (!ventureId) {
    const venture = await payload.create({ collection: 'ventures' as any, data: {
      name_en: (doc as any).ventureName_en,
      name_km: (doc as any).ventureName_km,
      country: (doc as any).country,
      triageTrack: (doc as any).triageTrack || 'unassigned',
      triageRationale: (doc as any).triageRationale,
    } })
    ventureId = venture.id
    await payload.update({ collection: 'onboardingIntakes' as any, id: (doc as any).id, data: { venture: ventureId } })
  }
  // Link venture.latestIntake
  await payload.update({ collection: 'ventures' as any, id: ventureId, data: { latestIntake: (doc as any).id } })
  // Agreements stubs if not exist
  const existing = await payload.find({ collection: 'agreements' as any, where: { venture: { equals: ventureId } }, limit: 2 })
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'agreements' as any, data: { venture: ventureId, type: 'NDA', status: 'not_requested' } })
    await payload.create({ collection: 'agreements' as any, data: { venture: ventureId, type: 'MOU', status: 'not_requested' } })
  }
  // Activity log
  await payload.create({ collection: 'activityLogs' as any, data: {
    action: 'intake.created', entity: 'onboardingIntakes', entityId: String((doc as any).id), timestamp: new Date().toISOString(),
  } })

  // TODO: Implement intake notification emails using the new Nodemailer email service
  // Email notifications for intake submissions have been temporarily disabled
  // during the migration from EmailJS to Nodemailer
  console.log('Intake created successfully. Email notifications currently disabled.')
}
