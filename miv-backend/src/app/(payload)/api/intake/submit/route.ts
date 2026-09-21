/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'

const FounderSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
})

const IntakeSchema = z.object({
  ventureName_en: z.string().min(1),
  country: z.string().min(1),
  description_en: z.string().optional(),
  wss: z.object({
    seeing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']),
    hearing: z.enum([
      'no_difficulty',
      'some_difficulty',
      'a_lot_of_difficulty',
      'cannot_do_at_all',
    ]),
    walking: z.enum([
      'no_difficulty',
      'some_difficulty',
      'a_lot_of_difficulty',
      'cannot_do_at_all',
    ]),
    cognition: z.enum([
      'no_difficulty',
      'some_difficulty',
      'a_lot_of_difficulty',
      'cannot_do_at_all',
    ]),
    selfCare: z.enum([
      'no_difficulty',
      'some_difficulty',
      'a_lot_of_difficulty',
      'cannot_do_at_all',
    ]),
    communication: z.enum([
      'no_difficulty',
      'some_difficulty',
      'a_lot_of_difficulty',
      'cannot_do_at_all',
    ]),
  }),
  registration: z
    .object({
      number: z.string().optional(),
      country: z.string().optional(),
      legalType: z.string().optional(),
      yearEstablished: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    })
    .optional(),
  impactAreas: z.array(z.enum(['agri', 'gender', 'climate'])).optional(),
  founders: z.array(FounderSchema).min(1),
  financials: z
    .object({
      currency: z.string().optional(),
      lastFYRevenue: z.number().optional(),
      avgMonthlyRevenue: z.number().optional(),
    })
    .optional(),
  gedsi: z.object({ hasPolicy: z.boolean().optional(), notes: z.string().optional() }).optional(),
  triageTrack: z.enum(['unassigned', 'fast', 'slow']).optional(),
  triageRationale: z.string().optional(),
})

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  try {
    // Simple rate limit per IP
    const ip = (req.headers.get('x-forwarded-for') || 'ip') as string
    ;(globalThis as any).__rl = (globalThis as any).__rl || new Map<string, number[]>()
    const store = (globalThis as any).__rl as Map<string, number[]>
    const now = Date.now()
    const arr = (store.get(ip) || []).filter((t) => now - t < 60_000)
    if (arr.length > 10) return Response.json({ error: 'Rate limited' }, { status: 429 })
    arr.push(now)
    store.set(ip, arr)
    const body = await req.json()
    const data = IntakeSchema.parse(body)

    // Duplicate detection by ventureName + country OR founder email
    const dupVenture = await (payload as any).find({
      collection: 'ventures',
      where: {
        and: [{ name_en: { equals: data.ventureName_en } }, { country: { equals: data.country } }],
      },
      limit: 1,
    })
    if (dupVenture.totalDocs > 0) {
      return Response.json({ error: 'Duplicate venture by name+country' }, { status: 409 })
    }
    const firstFounderEmail = data.founders[0].email
    const dupFounder = await (payload as any).find({
      collection: 'founders',
      where: { email: { equals: firstFounderEmail } },
      limit: 1,
    })
    if (dupFounder.totalDocs > 0) {
      return Response.json({ error: 'Duplicate founder email' }, { status: 409 })
    }

    // Create venture
    const venture = await (payload as any).create({
      collection: 'ventures',
      data: {
        name_en: data.ventureName_en,
        description_en: data.description_en,
        country: data.country,
        triageTrack: data.triageTrack ?? 'unassigned',
        triageRationale: data.triageRationale,
      },
    })

    // Create intake snapshot
    const disabilityFlag = Object.values(data.wss).some(
      (v) => v === 'a_lot_of_difficulty' || v === 'cannot_do_at_all',
    )
    const intake = await (payload as any).create({
      collection: 'onboardingIntakes',
      data: {
        venture: venture.id,
        ...data,
        disabilityFlag,
      },
    })

    // Link venture.latestIntake
    await (payload as any).update({
      collection: 'ventures',
      id: venture.id,
      data: { latestIntake: intake.id },
    })

    // Create founders and link
    for (const f of data.founders) {
      await (payload as any).create({
        collection: 'founders',
        data: { fullName: f.fullName, email: f.email, phone: f.phone, venture: venture.id },
      })
    }
    // Update venture founders array
    const founders = await (payload as any).find({
      collection: 'founders',
      where: { venture: { equals: venture.id } },
      limit: 50,
    })
    await (payload as any).update({
      collection: 'ventures',
      id: venture.id,
      data: {
        founders: founders.docs.map((f: any) => ({
          fullName: f.fullName,
          email: f.email,
          user: (f as any).user || undefined,
        })),
      },
    })

    // Create agreement stubs
    const nda = await (payload as any).create({
      collection: 'agreements',
      data: { venture: venture.id, type: 'NDA', status: 'not_requested' },
    })
    const mou = await (payload as any).create({
      collection: 'agreements',
      data: { venture: venture.id, type: 'MOU', status: 'not_requested' },
    })
    await (payload as any).update({
      collection: 'ventures',
      id: venture.id,
      data: { agreements: [nda.id, mou.id] },
    })

    // Activity log
    await (payload as any).create({
      collection: 'activityLogs',
      data: {
        action: 'intake.submit',
        entity: 'venture',
        entityId: String(venture.id),
        metadata: { intakeId: intake.id },
        timestamp: new Date().toISOString(),
      },
    })

    // Slack mock w/ feature flag
    const settings = await (payload as any).findGlobal({ slug: 'settings' })
    if (settings?.enableSlack && process.env.SLACK_WEBHOOK_URL) {
      console.log('Slack webhook mock:', { venture: venture.name_en, intakeId: intake.id })
    }

    return Response.json({ intakeId: intake.id, ventureId: venture.id })
  } catch (e: any) {
    console.error('intake submit error', e)
    return Response.json({ error: e.message ?? 'Invalid request' }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isStaff = user.role === 'admin' || user.role === 'miv_analyst'
    
    // Find the intake
    const intake = await (payload as any).findByID({ collection: 'onboardingIntakes', id })
    if (!intake) {
      return Response.json({ error: 'Intake not found' }, { status: 404 })
    }

    // Owner check: if founder, verify their email matches one of the founders in the intake
    if (!isStaff) {
      const isOwner = intake.founders?.some((f: any) => f.email === user.email)
      if (!isOwner) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return Response.json({
      success: true,
      data: {
        intakeId: id,
        status: 'submitted',
        submissionDate: intake.createdAt
      }
    })
  } catch (e: any) {
    console.error('GET intake error:', e)
    const isNotFound = e.name === 'CastError' || e.message?.toLowerCase().includes('not found') || e.status === 404
    return Response.json({ error: e.message ?? 'Internal error' }, { status: isNotFound ? 404 : 500 })
  }
}

