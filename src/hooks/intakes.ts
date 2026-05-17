/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/lib/email-service'

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

  // Send notification emails — errors are caught so intake creation is never blocked
  const ventureName = (doc as any).ventureName_en || (doc as any).ventureName_km || 'New Venture'
  const founderName = [(doc as any).primaryContactFirstName, (doc as any).primaryContactLastName]
    .filter(Boolean).join(' ') || undefined
  const founderEmail: string | undefined = (doc as any).primaryContactEmail

  try {
    if (founderEmail) {
      await emailService.sendIntakeConfirmationToFounder(founderEmail, {
        ventureName,
        founderName,
        submittedAt: new Date(),
      })
    }
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
    if (adminEmail) {
      await emailService.sendIntakeNotificationToAdmin(adminEmail, {
        ventureName,
        founderName,
        submittedAt: new Date(),
      })
    }
  } catch (emailError) {
    // Non-fatal: log the failure but never throw — intake must succeed regardless
    console.error('[intakes] Email notification failed (non-fatal):', emailError)
  }
}
