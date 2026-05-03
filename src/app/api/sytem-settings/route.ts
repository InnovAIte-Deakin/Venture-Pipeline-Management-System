import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const PatchSchema = z.object({
  account: z
    .object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      email: z.string().email().optional(),
    })
    .optional(),

  notifications: z
    .object({
      emailAlerts: z.boolean().optional(),
      inApp: z.boolean().optional(),
      push: z.boolean().optional(),
      frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
    })
    .optional(),

  // global settings should only be editable by admin
  global: z
    .object({
      appName: z.string().optional(),
      supportEmail: z.string().email().optional(),
      defaultLocale: z.enum(['en', 'km']).optional(),
      timezone: z.string().optional(),
      enableSignup: z.boolean().optional(),
      sessionTimeoutMinutes: z.number().min(5).max(1440).optional(),
      maxUploadMB: z.number().min(1).max(200).optional(),
      allowedMimeTypes: z
        .array(z.object({ mime: z.string().min(1) }))
        .optional(),
      features: z
        .object({
          enableImpactDashboard: z.boolean().optional(),
          enableGedsitracker: z.boolean().optional(),
          enableDiagnostics: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
})

async function getSingletonSystemSettings(payload: any) {
  const res = await payload.find({ collection: 'system-settings', limit: 1 })
  if (res.totalDocs > 0) return res.docs[0]

  // If not created yet, create one (admin normally does this from admin panel)
  return await payload.create({
    collection: 'system-settings',
    data: {
      appName: 'VPMS',
      supportEmail: 'support@example.com',
      defaultLocale: 'en',
      timezone: 'Australia/Melbourne',
      enableSignup: true,
      sessionTimeoutMinutes: 60,
      maxUploadMB: 10,
      allowedMimeTypes: [
        { mime: 'image/png' },
        { mime: 'image/jpeg' },
        { mime: 'application/pdf' },
      ],
      features: {
        enableImpactDashboard: true,
        enableGedsitracker: true,
        enableDiagnostics: true,
      },
    },
  })
}

async function getOrCreateUserSettings(payload: any, userId: string) {
  const res = await payload.find({
    collection: 'user-settings',
    where: { user: { equals: userId } },
    limit: 1,
  })

  if (res.docs?.length) return res.docs[0]

  return await payload.create({
    collection: 'user-settings',
    data: {
      user: userId,
      notifications: {
        emailAlerts: true,
        inApp: true,
        push: false,
        frequency: 'daily',
      },
    },
  })
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const global = await getSingletonSystemSettings(payload)
    const userSettings = await getOrCreateUserSettings(payload, String(user.id))

    return NextResponse.json({
      success: true,
      account: {
        firstName: user.first_name ?? '',
        lastName: user.last_name ?? '',
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
        email: user.email,
      },
      notifications: {
        emailAlerts: userSettings.notifications?.emailAlerts ?? true,
        inApp: userSettings.notifications?.inApp ?? true,
        push: userSettings.notifications?.push ?? false,
        frequency: userSettings.notifications?.frequency ?? 'daily',
      },
      global: {
        appName: global.appName,
        supportEmail: global.supportEmail,
        defaultLocale: global.defaultLocale,
        timezone: global.timezone,
        enableSignup: global.enableSignup,
        sessionTimeoutMinutes: global.sessionTimeoutMinutes,
        maxUploadMB: global.maxUploadMB,
        allowedMimeTypes: global.allowedMimeTypes ?? [],
        features: global.features ?? {},
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = PatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // 1) account update (self)
    if (parsed.data.account) {
      const a = parsed.data.account
      const u: Record<string, any> = {}
      if (a.firstName !== undefined) u.first_name = a.firstName
      if (a.lastName !== undefined) u.last_name = a.lastName
      if (a.email !== undefined) u.email = a.email.toLowerCase()

      if (Object.keys(u).length) {
        await payload.update({ collection: 'users', id: user.id, data: u })
      }
    }

    // 2) notifications update (self)
    if (parsed.data.notifications) {
      const doc = await getOrCreateUserSettings(payload, String(user.id))
      const n = parsed.data.notifications

      await payload.update({
        collection: 'user-settings',
        id: doc.id,
        data: {
          notifications: {
            emailAlerts: n.emailAlerts ?? doc.notifications?.emailAlerts ?? true,
            inApp: n.inApp ?? doc.notifications?.inApp ?? true,
            push: n.push ?? doc.notifications?.push ?? false,
            frequency: n.frequency ?? doc.notifications?.frequency ?? 'daily',
          },
        },
      })
    }

    // 3) global update (admin only)
    if (parsed.data.global) {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const globalDoc = await getSingletonSystemSettings(payload)
      await payload.update({
        collection: 'system-settings',
        id: globalDoc.id,
        data: parsed.data.global,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
