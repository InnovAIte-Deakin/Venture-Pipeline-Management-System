/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'

export const setDisabilityFlag: CollectionBeforeChangeHook = async ({ data }: any) => {
  try {
    if (data?.wss) {
      const difficult = Object.values(data.wss).some(
        (v: any) => v === 'a_lot_of_difficulty' || v === 'cannot_do_at_all',
      )

      return { ...data, disabilityFlag: difficult }
    }

    return data
  } catch (error) {
    console.error('Failed to set disability flag:', error)
    return data
  }
}

export const afterIntakeCreate: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}: any) => {
  if (operation !== 'create') return

  const payload = req.payload
  let ventureId = (doc as any).venture

  try {
    if (!ventureId) {
      try {
        const venture = await payload.create({
          collection: 'ventures' as any,
          data: {
            name_en: (doc as any).ventureName_en,
            name_km: (doc as any).ventureName_km,
            country: (doc as any).country,
            triageTrack: (doc as any).triageTrack || 'unassigned',
            triageRationale: (doc as any).triageRationale,
          },
        })

        ventureId = venture.id
      } catch (ventureCreateError) {
        console.error('Failed to create venture from intake:', ventureCreateError)
        throw new Error('Venture creation failed after intake submission')
      }

      try {
        await payload.update({
          collection: 'onboardingIntakes' as any,
          id: (doc as any).id,
          data: { venture: ventureId },
        })
      } catch (intakeUpdateError) {
        console.error('Failed to link intake with venture:', intakeUpdateError)
        throw new Error('Failed to link intake with venture')
      }
    }

    try {
      await payload.update({
        collection: 'ventures' as any,
        id: ventureId,
        data: { latestIntake: (doc as any).id },
      })
    } catch (latestIntakeError) {
      console.error('Failed to update venture latestIntake:', latestIntakeError)
    }

    try {
      const existing = await payload.find({
        collection: 'agreements' as any,
        where: { venture: { equals: ventureId } },
        limit: 2,
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'agreements' as any,
          data: { venture: ventureId, type: 'NDA', status: 'not_requested' },
        })

        await payload.create({
          collection: 'agreements' as any,
          data: { venture: ventureId, type: 'MOU', status: 'not_requested' },
        })
      }
    } catch (agreementError) {
      console.error('Failed to create agreement stubs:', agreementError)
    }

    try {
      await payload.create({
        collection: 'activityLogs' as any,
        data: {
          action: 'intake.created',
          entity: 'onboardingIntakes',
          entityId: String((doc as any).id),
          timestamp: new Date().toISOString(),
        },
      })
    } catch (logError) {
      console.error('Failed to create activity log:', logError)
    }

    console.log('Intake created successfully. Email notifications currently disabled.')
  } catch (error) {
    console.error('afterIntakeCreate failed:', error)
    throw error
  }
}